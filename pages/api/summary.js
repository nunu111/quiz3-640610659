import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin)
      return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary

    const users = readUsersDB();
    const infos = { userCount: 0, adminCount: 0, totalMoney: 0 };
    for (const key of users) {
      if (!key.isAdmin) {
        infos.userCount += 1;
        infos.totalMoney += key.money;
      } else if (key.isAdmin) {
        infos.adminCount += 1;
      }
    }
    return res.json({
      ok: true,
      userCount: infos.userCount,
      adminCount: infos.adminCount,
      totalMoney: infos.totalMoney,
    });
    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
