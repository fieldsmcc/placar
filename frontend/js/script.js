
const placarLimiteInput = document.getElementById("placarLimite");
const nomesJogadoresInput = document.getElementById("nomesJogadores");
const iniciarJogoBtn = document.getElementById("iniciarJogo");
const verHistoricoBtn = document.getElementById("verHistorico");
const tabela = document.getElementById("placarTabela");
const tbody = tabela.querySelector("tbody");
const rodadasHeader = document.getElementById("rodadasHeader");
const historicoContainer = document.querySelector(".historico-container");
const historicoLista = document.getElementById("historicoLista");

let rodadaAtual = 0;

// Habilitar o botão "Iniciar Jogo" apenas se os campos forem válidos
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => {
    const placarLimite = placarLimiteInput.value;
    const nomesJogadores = nomesJogadoresInput.value.split(",").map(nome => nome.trim());
    iniciarJogoBtn.disabled = !(placarLimite > 0 && nomesJogadores.length > 0 && nomesJogadores.length <= 5);
  });
});

iniciarJogoBtn.addEventListener("click", () => {
  rodadaAtual = 0;
  const placarLimite = parseInt(placarLimiteInput.value, 10);
  const nomesJogadores = nomesJogadoresInput.value.split(",").map(nome => nome.trim());

  tbody.innerHTML = "";
  rodadasHeader.innerHTML = ` 
    <th>JOGADOR</th>
    <th>TOTAL</th>
    ${Array.from({ length: placarLimite }, (_, i) => `<th>P${String(i + 1).padStart(2, '0')}</th>`).join('')}
  `;

  nomesJogadores.forEach(nome => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${nome}</td>
      <td class="total">0</td>
      ${Array.from({ length: placarLimite }, () => `<td contenteditable="true"></td>`).join('')}
    `;
    tbody.appendChild(row);
  });

  tabela.style.display = "table";
  adicionarEventosDeAtualizacao(placarLimite);
});

verHistoricoBtn.addEventListener("click", () => {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  historicoLista.innerHTML = historico
    .map(item => `<li>${item.data} - Vencedor: ${item.vencedor}, Pontuação: ${item.pontuacao}</li>`)
    .join("");
  historicoContainer.style.display = "block";
});

function adicionarEventosDeAtualizacao(placarLimite) {
  tabela.addEventListener("input", () => {
    const jogadores = Array.from(tbody.querySelectorAll("tr"));
    let rodadaCompleta = true;

    jogadores.forEach(jogador => {
      const rodadaCell = jogador.children[rodadaAtual + 2];
      if (!rodadaCell.textContent.trim() || isNaN(parseInt(rodadaCell.textContent.trim(), 10))) {
        rodadaCompleta = false;
      }
    });

    if (rodadaCompleta) {
      let jogoEncerrado = false;

      jogadores.forEach(jogador => {
        const cells = jogador.querySelectorAll('td[contenteditable="true"]');
        const totalCell = jogador.querySelector(".total");
        let total = 0;

        cells.forEach(cell => {
          const value = parseInt(cell.textContent, 10);
          if (!isNaN(value)) total += value;
        });

        totalCell.textContent = total;

        if (total >= placarLimite) {
          const vencedor = jogador.firstChild.textContent;
          alert(`Jogo encerrado! ${vencedor} venceu com ${total} pontos.`);
          salvarNoHistorico(vencedor, total);
          desativarEdicao();
          jogoEncerrado = true;
        }
      });

      if (!jogoEncerrado) {
        rodadaAtual++;
        if (rodadaAtual >= rodadasHeader.children.length - 2) {
          adicionarRodada();
        }
      }
    }
  });
}

function salvarNoHistorico(vencedor, pontuacao) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.push({
    vencedor: vencedor,
    pontuacao: pontuacao,
    data: new Date().toLocaleString()
  });
  localStorage.setItem("historico", JSON.stringify(historico));
}

function adicionarRodada() {
  rodadasHeader.innerHTML += `<th>P${String(rodadaAtual + 1).padStart(2, '0')}</th>`;
  tbody.querySelectorAll("tr").forEach(jogador => {
    const newCell = document.createElement("td");
    newCell.setAttribute("contenteditable", "true");
    jogador.appendChild(newCell);
  });
}

function desativarEdicao() {
  tabela.querySelectorAll("td[contenteditable='true']").forEach(cell => {
    cell.contentEditable = false;
  });
}

function adicionarEventosDeAtualizacao(placarLimite) {
tabela.addEventListener("input", () => {
const jogadores = Array.from(tbody.querySelectorAll("tr"));
let rodadaCompleta = true;

jogadores.forEach(jogador => {
  const rodadaCell = jogador.children[rodadaAtual + 2];
  if (!rodadaCell.textContent.trim() || isNaN(parseInt(rodadaCell.textContent.trim(), 10))) {
    rodadaCompleta = false;
  }
});

if (rodadaCompleta) {
  let jogoEncerrado = false;

  jogadores.forEach(jogador => {
    const cells = jogador.querySelectorAll('td[contenteditable="true"]');
    const totalCell = jogador.querySelector(".total");
    let total = 0;

    // Calcular total de pontos para o jogador
    cells.forEach(cell => {
      const value = parseInt(cell.textContent, 10);
      if (!isNaN(value)) total += value;
    });

    totalCell.textContent = total;

    // Verificar se o jogador venceu
    if (total >= placarLimite) {
      const vencedor = jogador.firstElementChild.textContent; // Nome do jogador
      alert(`Jogo encerrado! ${vencedor} venceu com ${total} pontos.`);
      salvarNoHistorico(vencedor, total); // Salvar o vencedor no histórico
      desativarEdicao();
      jogoEncerrado = true;
    }
  });

  // Adicionar nova rodada, caso o jogo não tenha sido encerrado
  if (!jogoEncerrado) {
    rodadaAtual++;
    if (rodadaAtual >= rodadasHeader.children.length - 2) {
      adicionarRodada();
    }
  }
}
});
}

function salvarNoHistorico(vencedor, pontuacao) {
const historico = JSON.parse(localStorage.getItem("historico")) || [];
historico.push({
vencedor: vencedor,
pontuacao: pontuacao,
data: new Date().toLocaleString()
});
localStorage.setItem("historico", JSON.stringify(historico));
}

verHistoricoBtn.addEventListener("click", () => {
const historico = JSON.parse(localStorage.getItem("historico")) || [];
historicoLista.innerHTML = historico
.map(item => `<li>${item.data} - Vencedor: ${item.vencedor}, Pontuação: ${item.pontuacao}</li>`)
.join("");
historicoContainer.style.display = "block";
});

function desativarEdicao() {
tabela.querySelectorAll("td[contenteditable='true']").forEach(cell => {
cell.contentEditable = false;
});
}
