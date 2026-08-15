import "./src/config/configuration";
import db from "./src/modules"

db.sequelize?.sync().then(() => {
  console.log("Database initialized successfully")
}).catch(e => {
  console.log("Error: Database didn't initialized", e)
})