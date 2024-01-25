import express from 'express';
import bodyParser from 'body-parser';
import {AuthController} from '../controllers/auth.controller';


const router = express.Router();
const authController: AuthController = new AuthController();

router.use(bodyParser.json());

/**
 * Login user
 * (./auth/login)
 *
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res) => {
    try {
      //Validate request
      if (!req.body.user_name || !req.body.password) {
        res.status(400).send({ success: 'false', data: null, error: 'Feilds cannot be empty' });
        return;
      }

      const response = await authController.login(req.body.user_name, req.body.password);
      res.status(200).send(response);
    } catch (err) {
      res.status(401).send({ message: err });
    }
  };
  router.post('/login', login);
  