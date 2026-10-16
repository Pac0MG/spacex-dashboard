// Keep the keys in sync with en.js. vue-i18n treats { } @ | as syntax, so a
// literal one is written as {'@'}.
export default {
  nav: {
    launches: "Lançamentos",
    rockets: "Foguetões",
    viewProfile: "{username} — ver perfil",
    logout: "Terminar sessão",
    switchToLight: "Mudar para o modo claro",
    switchToDark: "Mudar para o modo escuro",
    language: "Idioma",
  },

  status: {
    success: "Sucesso",
    failure: "Falha",
    upcoming: "Agendado",
    active: "Ativo",
    inactive: "Inativo",
    retired: "Retirado",
  },

  common: {
    noImage: "Sem imagem",
    missionPatch: "Emblema da missão {name}",
    backToTop: "Voltar ao topo",
    dismiss: "Fechar notificação",
  },

  favorites: {
    add: "Adicionar aos favoritos",
    remove: "Remover dos favoritos",
    favorited: "★ Nos favoritos",
    addButton: "☆ Adicionar aos favoritos",
  },

  empty: {
    title: "Sem resultados",
    message: "Não há resultados para apresentar.",
  },

  errors: {
    title: "Ups, algo correu mal!",
    retry: "Tentar novamente",
    loadLaunches:
      "Não foi possível carregar os lançamentos. Tenta novamente mais tarde.",
    loadRockets:
      "Não foi possível carregar os foguetões. Tenta novamente mais tarde.",
    api: "Erro da API: {message}",
    apiGeneric: "Algo correu mal na comunicação com a API.",
    generic: "Algo correu mal.",
    authUnreachable:
      "Não foi possível contactar o servidor de autenticação. Confirma que está a correr (npm run server).",
  },

  launches: {
    title: "Lançamentos",
    subtitle: "Explora os lançamentos da SpaceX.",
    searchName: "Nome",
    searchYear: "Ano",
    searchByName: "Pesquisar por nome...",
    searchByYear: "Pesquisar por ano...",
    emptyTitle: "Não há resultados para apresentar",
    tryName: "Experimenta outro nome",
    tryYear: "Experimenta outro ano",
    previous: "Anterior",
    next: "Seguinte",
    page: "Página {current} de {total}",
    viewDetails: "Ver detalhes",
  },

  filter: {
    title: "Filtrar lançamentos",
    favoritesOnly: "Só favoritos ★",
    year: "Ano",
    allYears: "Todos os anos",
  },

  launchDetail: {
    back: "← Voltar aos lançamentos",
    notFoundTitle: "Lançamento não encontrado",
    notFoundMessage: "Não foi possível encontrar este lançamento.",
    description: "Descrição",
    noDescription: "Sem descrição disponível.",
    rocket: "Foguetão",
    state: "Estado",
    rocketUnavailable: "Informação do foguetão indisponível.",
    links: "Ligações",
    webcast: "Transmissão",
    article: "Artigo",
    wikipedia: "Wikipédia",
  },

  nextLaunch: {
    eyebrow: "Próximo lançamento",
    viewDetails: "Ver detalhes da missão",
    days: "Dias",
    hours: "Horas",
    minutes: "Min",
    seconds: "Seg",
    liftoff: "🚀 Descolagem!",
  },

  rockets: {
    title: "Foguetões",
    subtitle: "Explora os foguetões da SpaceX.",
    emptyTitle: "Nenhum foguetão encontrado",
    emptyMessage: "Não há foguetões para apresentar.",
    photoOf: "Fotografia do {name}",
    firstFlight: "Primeiro voo",
    height: "Altura",
    diameter: "Diâmetro",
    mass: "Massa",
    country: "País",
    successRate: "Taxa de sucesso",
    costPerLaunch: "Custo por lançamento",
  },

  search: {
    open: "Abrir pesquisa ({shortcut})",
    label: "Pesquisar",
    dialog: "Pesquisa global",
    placeholder: "Pesquisar missões ou foguetões...",
    missions: "Missões",
    rockets: "Foguetões",
    rocket: "Foguetão",
    noResults: "Sem resultados para \"{query}\"",
    hint: "Escreve para pesquisar missões e foguetões. Usa ↑ ↓ para navegar, Enter para abrir e Esc para fechar.",
  },

  notFound: {
    title: "Perdido no espaço",
    text: "Esta página não existe, ou foi lançada para uma órbita que não conseguimos alcançar.",
    back: "Voltar aos lançamentos",
  },

  auth: {
    fields: {
      name: "Nome",
      username: "Nome de utilizador",
      email: "Email",
      password: "Palavra-passe",
    },
    passwordHint:
      "Pelo menos 9 caracteres, 1 letra maiúscula e 1 carácter especial.",
    rulesNotMet: "A palavra-passe não cumpre todos os requisitos.",
    mismatch: "As palavras-passe não coincidem.",

    login: {
      title: "Iniciar sessão",
      subtitle:
        "Usa o teu email ou nome de utilizador e a palavra-passe para continuar.",
      resetDone:
        "Palavra-passe alterada. Inicia sessão com a nova palavra-passe.",
      identifier: "Email ou nome de utilizador",
      forgot: "Esqueceste-te da palavra-passe?",
      submit: "Iniciar sessão",
      submitting: "A iniciar sessão...",
      noAccount: "Não tens conta?",
      signupLink: "Criar conta",
      missing:
        "Introduz o teu email ou nome de utilizador e a palavra-passe.",
    },

    signup: {
      title: "Criar conta",
      subtitle: "Cria uma conta para explorar os lançamentos da SpaceX.",
      confirm: "Confirmar palavra-passe",
      submit: "Criar conta",
      submitting: "A criar conta...",
      haveAccount: "Já tens conta?",
      loginLink: "Iniciar sessão",
    },

    forgot: {
      title: "Recuperar palavra-passe",
      subtitle:
        "Introduz o email da tua conta e enviamos-te uma ligação para escolheres uma nova palavra-passe.",
      sent: "Se existir uma conta para {email}, vais receber uma ligação de reposição. É válida durante 1 hora.",
      submit: "Enviar ligação",
      submitting: "A enviar...",
      back: "Voltar ao início de sessão",
      missing: "Introduz o teu endereço de email.",
    },

    reset: {
      title: "Nova palavra-passe",
      subtitle: "Escolhe uma nova palavra-passe para a tua conta.",
      incomplete: "Esta ligação de reposição está incompleta. Pede uma nova.",
      password: "Nova palavra-passe",
      confirm: "Confirmar nova palavra-passe",
      submit: "Alterar palavra-passe",
      submitting: "A guardar...",
      newLink: "Pedir uma nova ligação",
    },
  },

  password: {
    show: "Mostrar palavra-passe",
    hide: "Ocultar palavra-passe",
    requirements: "Requisitos da palavra-passe",
    met: "(cumprido)",
    notMet: "(por cumprir)",
    rules: {
      length: "Pelo menos 9 caracteres",
      uppercase: "Pelo menos 1 letra maiúscula",
      special: "Pelo menos 1 carácter especial (ex.: ! {'@'} # $ %)",
    },
  },

  avatar: {
    choose: "Escolher uma fotografia de perfil",
    preview: "Pré-visualização da fotografia de perfil",
    change: "Alterar",
    add: "Adicionar foto",
    remove: "Remover fotografia",
    optional: "Opcional",
    tooLarge: "Escolhe um ficheiro de imagem com menos de 10 MB.",
    unreadable: "Não foi possível ler essa imagem. Experimenta outra.",
  },

  profile: {
    photoHint: "Clica para adicionar uma fotografia",
    deleteAccount: "Eliminar conta",
    deleteWarning:
      "Isto elimina a tua conta de forma permanente e não pode ser desfeito. Introduz a palavra-passe para confirmar.",
    cancel: "Cancelar",
    deleteConfirm: "Eliminar a minha conta",
    deleting: "A eliminar...",
    deleteMissing: "Introduz a palavra-passe para confirmar.",
    deleted: "A tua conta foi eliminada.",
    favoritesTitle: "Lançamentos favoritos",
    noFavoritesTitle: "Ainda não tens lançamentos favoritos",
    noFavoritesMessage: "Toca na estrela de um lançamento para o guardares aqui.",
  },
};
