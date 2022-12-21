import Users from "../models/UserModel.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { name, email, nomorHp, password, confPassword } = req.body;
    const angka = /^[0-9]+$/;

    if (password !== confPassword) {
        return res.status(400).json({
            tipe: 1,
            msg: "Password tidak sama!"
        })
    } else if (!name || !nomorHp || !email || !password || !confPassword) {
        return res.status(400).json({
            tipe: 2,
            msg: "data belum lengkap"
        })
    } else if (!nomorHp.match(angka)) {
        return res.status(400).json({
            tipe: 6,
            msg: "Nomor HP mengandung huruf!"
        })
    } else {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await Users.findAll({
            where: {
                email: email
            }
        })
        if (user.length > 0) {
            return res.status(400).json({
                tipe: 3,
                msg: "Email sudah terdaftar!"
            })
        } else {
            const insert = await Users.create({
                name: name,
                email: email,
                password: hashPassword,
                nomorHp: nomorHp,
                role: 2,
                status: 0
            })
            if (insert) {
                res.status(200).json({
                    tipe: 4,
                    msg: "Data berhasil disimpan!"
                })
            } else {
                res.status(400).json({
                    tipe: 5,
                    msg: "Data gagal disimpan!"
                })
            }
        }
    }





    // const { name, email, password, confPassword } = req.body;
    // if (password !== confPassword) return res.status(400).json({
    //     msg: "Password tidak sama!",
    //     stts: "password"
    // }
    // );
    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(password, salt);
    // try {
    //     const user = await Users.findAll({
    //         where: {
    //             email: email
    //         }
    //     });
    //     if (user.length > 0) {
    //         res.json({
    //             msg: 'email sudah terdaftar!'
    //         })
    //         console.log('email sudah terdaftar!');
    //     } else {
    //         await Users.create({
    //             name: name,
    //             email: email,
    //             password: hashPassword
    //         });
    //         res.json({ msg: "Registration Successful" });
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
}

export const Login = async (req, res) => {
    const user = await Users.findAll({
        where: {
            email: req.body.email
        }
    });

    const verifikasi = await Users.findAll({
        where: {
            email: req.body.email,
            status: 1
        }
    })

    if (user.length == 0) {
        res.status(404).json({ msgEmailTidakDiTemukan: "Email tidak di temukan!" });
    } else if (user.length == 1 && verifikasi.length == 0) {
        res.status(404).json({ msgStatus: "Anda belum di verifikasi!" });
    } else {
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({
            msgPasswordSalah: "Password salah!"
        });

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({
            userId,
            name,
            email
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({
            userId,
            name,
            email
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({
            refresh_token: refreshToken
        }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({
            accessToken
        });
    }
}


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}