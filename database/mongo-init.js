db = db.getSiblingDB("admin")
db.auth("admin","admin")
db = db.getSiblingDB("goblin_db")

db.createUser({
    user: "user",
    pwd: "user",
    roles: [
        {
            role: "readWrite",
            db: "goblin_db"
        }
    ]
});
