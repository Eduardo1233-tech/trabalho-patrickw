// npm init
// npm i expressconst express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET não definido. Crie o arquivo .env");
    process.exit(1);
}

app.post("/cliente", async (req, res) => {
    try {
        const { nome, cpf, celular, email, senha } = req.body || {};

        if (!nome || !cpf || !celular || !email || !senha) {
            return res.status(400).json({ msg: "Preencha nome, cpf, celular, email e senha." });
        }
        if (String(senha).length < 6) {
            return res.status(400).json({ msg: "A senha deve ter pelo menos 6 caracteres." });
        }

        const senhaCript = await bcrypt.hash(String(senha), 10);

        const resultado = await db.pool.query(
            `INSERT INTO cliente (nome, cpf, celular, email, senha) VALUES (?, ?, ?, ?, ?)`,
            [nome, cpf, celular, email, senhaCript]
        );

        res.status(201).json({ msg: "Cliente cadastrado, ID = " + resultado[0].insertId });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ msg: "CPF ou email já cadastrado." });
        }
        if (error.code === "ER_DATA_TOO_LONG") {
            return res.status(400).json({ msg: "Algum campo excede o limite de caracteres." });
        }
        console.error(error);
        res.status(500).json({ erro: "Erro interno" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = req.body || {};
        if (!user.email || !user.senha) {
            return res.status(400).json({ msg: "Informe email e senha." });
        }

        const resultado = await db.pool.query(
            "SELECT id, nome, email, senha FROM cliente WHERE email = ?", [user.email]
        );
        const dados_bd = resultado[0][0];

        const senha_valida = dados_bd
            ? await bcrypt.compare(String(user.senha), dados_bd.senha)
            : false;

        if (!senha_valida) {
            return res.status(401).json({ msg: "Email ou senha inválidos!" });
        }

        const payload = {
            id: dados_bd.id,
            email: dados_bd.email
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.status(200).json({ nome: dados_bd.nome, token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno" });
    }
});

app.get("/cliente/perfil", autenticar, async (req, res) => {
    try {
        const id = req.usuario.id;
        const result = await db.pool.query(
            "SELECT id, nome, cpf, celular, email FROM cliente WHERE id = ?", [id]
        );
        const perfil = result[0][0];
        if (!perfil) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }
        res.status(200).json(perfil);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});

app.get("/produto", async (req, res) => {
    try {
        const { nome, categoria, preco_min, preco_max, ordem, pagina } = req.query;
        
        let sql = "SELECT * FROM produto WHERE 1=1";
        const params = [];
        
        if (nome) {
            sql += " AND nome LIKE ?";
            params.push(`%${nome}%`);
        }
        
        if (categoria) {
            sql += " AND categoria = ?";
            params.push(categoria);
        }
        
        if (preco_min) {
            sql += " AND preco >= ?";
            params.push(preco_min);
        }
        
        if (preco_max) {
            sql += " AND preco <= ?";
            params.push(preco_max);
        }
        
        if (ordem === "asc" || ordem === "ASC") {
            sql += " ORDER BY preco ASC";
        } else if (ordem === "desc" || ordem === "DESC") {
            sql += " ORDER BY preco DESC";
        } else if (ordem === "menor" || ordem === "maior") {
            sql += ordem === "menor" ? " ORDER BY preco ASC" : " ORDER BY preco DESC";
        } else {
            sql += " ORDER BY id ASC";
        }
        
        const limit = 10;
        const page = parseInt(pagina) || 1;
        const offset = (page - 1) * limit;
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
        
        const resultado = await db.pool.query(sql, params);
        const produtos = resultado[0];
        
        res.status(200).json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno" });
    }
});

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ erro: "Token não enviado" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: "Token inválido" });
        req.usuario = usuario;
        next();
    });
}

app.listen(port, () => {
    console.log("API rodando na porta " + port);
});