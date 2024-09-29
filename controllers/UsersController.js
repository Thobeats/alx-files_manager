import dbClient from "../utils/db";
import sha1 from "sha1";

class UserController {
    static async postNew(req, res){
       const email = req.body.email;
       let password = req.body.password;

       if (!email) return res.status(400).send({ error: 'Missing email' });
       if (!password) return res.status(400).send({ error: 'Missing password' });

       const checkEmail = await dbClient.checkUser(email);
       if (checkEmail) return res.status(400).send({ error: 'Already exist' });

       password = sha1(password);

       const saveUser = await dbClient.saveNewUser(email, password);

       return res.status(201).send({id: saveUser.ops[0]["_id"], email: saveUser.ops[0]["email"]});
    }
}

export default UserController;