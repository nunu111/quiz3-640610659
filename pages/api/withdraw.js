import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    if (!user || user.isAdmin)
      return res
        .status(403)
        .json({ ok: false, message: "You do not have permission to withdraw" });

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount < 1)
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });

    const users = readUsersDB();
    const foundUserIdx = users.findIndex((x) => x.username === user.username);
    if (foundUserIdx === -1)
      return res
        .status(403)
        .json({ ok: false, message: "You do not have permission to deposit" });
    if (users[foundUserIdx].money >= amount) {
      users[foundUserIdx].money -= amount;
      writeUsersDB(users);
      return res.json({ ok: true, money: users[foundUserIdx].money });
    } else {
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    }
    //find and update money in DB (if user has enough money)

    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
