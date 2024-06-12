const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Substitua pelo seu token do GitHub
const GITHUB_TOKEN = '';
const GITHUB_USERNAME = 'jorgluiz';

const headers = {
    "Authorization": `token ${GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3+json"
};

// Função para tornar um repositório privado
async function makeRepoPrivate(repoName) {
    const repoUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`;
    try {
        await axios.patch(repoUrl, { private: true }, { headers: headers });
        console.log(`Repositório '${repoName}' agora é privado.`);
    } catch (error) {
        console.error(`Falha ao tornar o repositório '${repoName}' privado:`, error.response ? error.response.data : error.message);
    }
}

// Função principal para obter e tornar privados todos os repositórios
async function makeAllReposPrivate() {
    const reposUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    try {
        const response = await axios.get(reposUrl, { headers: headers });
        const repos = response.data;
        for (const repo of repos) {
            if (!repo.private) {
                await makeRepoPrivate(repo.name);
            }
        }
    } catch (error) {
        console.error("Falha ao obter repositórios:", error.response ? error.response.data : error.message);
    }
}

app.get('/repos-private', async (req, res) => {
    // Executa a função principal
    await makeAllReposPrivate();
    res.send("Repositórios tornados privados com sucesso!");
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
