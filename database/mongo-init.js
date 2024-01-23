db = db.getSiblingDB("admin")
db.auth("admin", "admin")
db = db.getSiblingDB("goblin_db")

db.createUser({
  user: "user",
  pwd: "user",
  roles: [
    {
      role: "readWrite",
      db: "goblin_db",
    },
  ],
})

db.createCollection("user_collection")

db.user_collection.insertMany([
  {
    user_name: "user",
    password: "pass",
    name: "user",
    token: "",
  },
  {
    user_name: "kjartan",
    password: "pass123",
    name: "kjartan",
    token: "",
  },
])
