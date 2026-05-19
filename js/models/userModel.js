function createUser(name, email, password, isAdmin = false) {
  return {
    name,
    email,
    password,

    isAdmin,

    points: 0,
    level: 1,

    progress: {
      a: 0,
      b: 0,
      c: 0
    },

    skillLevel: {
      a: 1,
      b: 1,
      c: 1
    },

    history: []
  };
}