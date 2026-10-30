const db = require("./db");

async function criar_tabelas() {
    try {
        await db.pool.query(`
            DROP TABLE IF EXISTS cliente;
            CREATE TABLE cliente (
                id int NOT NULL AUTO_INCREMENT,
                nome varchar(100) NOT NULL,
                cpf char(14) NOT NULL,
                celular varchar(15) NOT NULL,
                email varchar(100) NOT NULL,
                senha varchar(512) NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY cpf (cpf),
                UNIQUE KEY email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

            INSERT INTO cliente (id, nome, cpf, celular, email, senha) VALUES 
                (1, 'Eduardo Henrique', '111.222.333-44', '(42)99999-4444', 'eduardo@gmail.com', '$2b$10$N8b2YuzXWdMJVAAd670qG.ScLlmdFsuTJ7C6/GWtMKWhj8O0pU6Pu'),
                (2, 'Lucas Silva', '222.333.444-55', '(42)99888-1111', 'lucas.silva@gmail.com', '$2b$10$rNwWgUx8kezhoZXXuVG7NeBXqPFAzpkc37Sg4P.ETVtiSaWWqBHxy'),
                (3, 'Mariana Costa', '333.444.555-66', '(41)99777-2222', 'mari.costa@hotmail.com', '$2b$10$MZMnDj10f7JnV6ArP.5hm.TAHDZ5NwECYSw6i5kbNowwhPuqbC/W.');

            DROP TABLE IF EXISTS produto;
            CREATE TABLE produto (
                id int NOT NULL AUTO_INCREMENT,
                nome varchar(150) NOT NULL,
                categoria varchar(100) NOT NULL,
                preco decimal(10,2) NOT NULL,
                descricao varchar(255),
                imagem varchar(255),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

            INSERT INTO produto (nome, categoria, preco, descricao) VALUES
                ('Kimono Branco', 'kimono', 299.90, 'Kimono para treino'),
                ('Kimono Azul', 'kimono', 349.90, 'Kimono profissional'),
                ('Luva de Muay Thai', 'luva', 199.90, 'Luva 10oz'),
                ('Luva de Boxe', 'luva', 249.90, 'Luva 12oz'),
                ('Protetor Bucal', 'protetor', 29.90, 'Protetor moldável'),
                ('Caneleira', 'protetor', 89.90, 'Caneleira reforçada'),
                ('Faixa Branca', 'faixa', 39.90, 'Faixa iniciantes'),
                ('Faixa Preta', 'faixa', 59.90, 'Faixa avançada'),
                ('Processador Ryzen 5', 'processador', 899.90, 'Processador AMD'),
                ('Processador Intel i5', 'processador', 799.90, 'Processador Intel'),
                ('Abafador Auricular', 'acessorio', 49.90, 'Proteção auditiva'),
                ('Saco de Pancada', 'saco', 499.90, 'Saco para treino'),
                ('Shorts MMA', 'shorts', 129.90, 'Shorts de treino'),
                ('Rashguard', 'camiseta', 159.90, 'Camiseta compressiva'),
                ('Tornozeleira', 'protetor', 69.90, 'Proteção para treino');
        `);
        console.log("Banco de dados configurado com sucesso!");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

criar_tabelas();