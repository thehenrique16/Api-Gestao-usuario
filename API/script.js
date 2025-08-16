// ================== Estado ==================
let usuarios = [];
let funcionarios = [];

let usuarioSelecionadoId = null;     // para editar/alocar
let funcionarioEditIndex = null;     // para editar funcionário

// ================== Util: Overlay ==================
function mostrarOverlayComConclusao() {
  const overlay = document.getElementById("overlay");
  const content = document.getElementById("overlay-content");
  overlay.classList.add("active");
  content.innerHTML = '<div class="loading"></div>';

  setTimeout(() => {
    content.innerHTML = '<div class="done">Concluído ✔</div>';
    setTimeout(() => overlay.classList.remove("active"), 1200);
  }, 1200);
}

// ================== Helpers de Modal ==================
function abrirModal(selector) {
  document.querySelector(selector).classList.add("active");
}
function fecharModal(selector) {
  document.querySelector(selector).classList.remove("active");
}
document.addEventListener("click", (e) => {
  // Botões com data-close="#idDoModal"
  const btn = e.target.closest("[data-close]");
  if (btn) fecharModal(btn.getAttribute("data-close"));
});

// ================== USUÁRIOS ==================
function renderUsuarios() {
  const wrap = document.getElementById("listaUsuarios");
  wrap.innerHTML = "";
  usuarios.forEach((u) => {
    const div = document.createElement("div");
    div.className = "usuario";
    div.innerHTML = `
      <div>
        <strong>ID:</strong> ${u.id} <br>
        <strong>Nome:</strong> ${u.nome} <br>
        <strong>Email:</strong> ${u.email} <br>
        <strong>Empresa:</strong> ${u.empresa ? u.empresa : "Nenhuma"} ${u.cnpj ? `- CNPJ: ${u.cnpj}` : "" }
      </div>
      <div class="actions">
        <button class="btn" data-action="editar" data-id="${u.id}">Editar</button>
        <button class="btn cancelar" data-action="excluir" data-id="${u.id}">Excluir</button>
        <button class="btn confirmar" data-action="alocar" data-id="${u.id}">Alocar Empresa</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function cadastrarUsuario() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!nome || !email) { alert("Preencha nome e email."); return; }

  const novo = {
    id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nome, email,
    empresa: null, cnpj: null
  };
  usuarios.push(novo);

  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  renderUsuarios();
  mostrarOverlayComConclusao();
}

function abrirEditarUsuario(id) {
  usuarioSelecionadoId = id;
  const u = usuarios.find(x => x.id === id);
  if (!u) return;
  document.getElementById("editUserNome").value = u.nome;
  document.getElementById("editUserEmail").value = u.email;
  abrirModal("#editarUsuarioModal");
}

function salvarEdicaoUsuario() {
  const u = usuarios.find(x => x.id === usuarioSelecionadoId);
  if (!u) return;
  u.nome = document.getElementById("editUserNome").value.trim();
  u.email = document.getElementById("editUserEmail").value.trim();
  fecharModal("#editarUsuarioModal");
  renderUsuarios();
  mostrarOverlayComConclusao();
}

function excluirUsuario(id) {
  usuarios = usuarios.filter(u => u.id !== id);
  renderUsuarios();
  mostrarOverlayComConclusao();
}

function abrirEmpresaUsuario(id) {
  usuarioSelecionadoId = id;
  const u = usuarios.find(x => x.id === id);
  document.getElementById("empresaNome").value = u?.empresa || "";
  document.getElementById("empresaCnpj").value = u?.cnpj || "";
  abrirModal("#empresaModal");
}

function salvarEmpresaUsuario(e) {
  e.preventDefault();
  const u = usuarios.find(x => x.id === usuarioSelecionadoId);
  if (!u) return;
  u.empresa = document.getElementById("empresaNome").value.trim();
  u.cnpj   = document.getElementById("empresaCnpj").value.trim();
  fecharModal("#empresaModal");
  renderUsuarios();
  mostrarOverlayComConclusao();
}

// Delegação de eventos da lista de usuários
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#listaUsuarios .actions .btn");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-id"));
  const action = btn.getAttribute("data-action");
  if (action === "editar") abrirEditarUsuario(id);
  if (action === "excluir") excluirUsuario(id);
  if (action === "alocar") abrirEmpresaUsuario(id);
});

// ================== FUNCIONÁRIOS ==================
function renderFuncionarios() {
  const wrap = document.getElementById("listaFuncionarios");
  wrap.innerHTML = "";
  funcionarios.forEach((f, i) => {
    const div = document.createElement("div");
    div.className = "func-item";
    div.innerHTML = `
      <div>
        <strong>${f.nome}</strong> — ${f.cargo} (${f.empresa})<br>
        📧 ${f.email} | 📞 ${f.telefone} | CPF: ${f.cpf}
      </div>
      <div class="actions">
        <button class="btn" data-f="editar" data-index="${i}">Editar</button>
        <button class="btn cancelar" data-f="excluir" data-index="${i}">Excluir</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function abrirAddFuncionario() {
  // limpa campos
  ["addNome","addEmail","addCpf","addTelefone","addEmpresa","addCargo"]
    .forEach(id => document.getElementById(id).value = "");
  abrirModal("#addFuncionarioModal");
}

function salvarNovoFuncionario() {
  const f = {
    nome:      document.getElementById("addNome").value.trim(),
    email:     document.getElementById("addEmail").value.trim(),
    cpf:       document.getElementById("addCpf").value.trim(),
    telefone:  document.getElementById("addTelefone").value.trim(),
    empresa:   document.getElementById("addEmpresa").value.trim(),
    cargo:     document.getElementById("addCargo").value.trim(),
  };
  if (!f.nome || !f.email) { alert("Preencha ao menos Nome e Email."); return; }
  funcionarios.push(f);
  fecharModal("#addFuncionarioModal");
  renderFuncionarios();
  mostrarOverlayComConclusao();
}

function abrirEditarFuncionario(index) {
  funcionarioEditIndex = index;
  const f = funcionarios[index];
  document.getElementById("editNome").value = f.nome;
  document.getElementById("editEmail").value = f.email;
  document.getElementById("editCpf").value = f.cpf;
  document.getElementById("editTelefone").value = f.telefone;
  document.getElementById("editEmpresa").value = f.empresa;
  document.getElementById("editCargo").value = f.cargo;
  abrirModal("#editarFuncionarioModal");
}

function salvarEdicaoFuncionario() {
  if (funcionarioEditIndex === null) return;
  funcionarios[funcionarioEditIndex] = {
    nome:      document.getElementById("editNome").value.trim(),
    email:     document.getElementById("editEmail").value.trim(),
    cpf:       document.getElementById("editCpf").value.trim(),
    telefone:  document.getElementById("editTelefone").value.trim(),
    empresa:   document.getElementById("editEmpresa").value.trim(),
    cargo:     document.getElementById("editCargo").value.trim(),
  };
  funcionarioEditIndex = null;
  fecharModal("#editarFuncionarioModal");
  renderFuncionarios();
  mostrarOverlayComConclusao();
}

function excluirFuncionario(index) {
  funcionarios.splice(index, 1);
  renderFuncionarios();
  mostrarOverlayComConclusao();
}

// Delegação de eventos lista de funcionários
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#listaFuncionarios .actions .btn");
  if (!btn) return;
  const index = Number(btn.getAttribute("data-index"));
  const ac = btn.getAttribute("data-f");
  if (ac === "editar") abrirEditarFuncionario(index);
  if (ac === "excluir") excluirFuncionario(index);
});

// ================== Listeners iniciais ==================
document.getElementById("btnCadastrarUsuario").addEventListener("click", cadastrarUsuario);
document.getElementById("empresaForm").addEventListener("submit", salvarEmpresaUsuario);
document.getElementById("btnSalvarEditUsuario").addEventListener("click", salvarEdicaoUsuario);

document.getElementById("btnAbrirAddFuncionario").addEventListener("click", abrirAddFuncionario);
document.getElementById("btnSalvarNovoFuncionario").addEventListener("click", salvarNovoFuncionario);
document.getElementById("btnSalvarEditFuncionario").addEventListener("click", salvarEdicaoFuncionario);

// Primeiros renders (listas vazias)
renderUsuarios();
renderFuncionarios();
