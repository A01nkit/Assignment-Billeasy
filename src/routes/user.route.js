import {Router} from "express"
import { 
    signup,
    login,
    logout,
    refresh_AccessToken
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout)
router.route("/refresh-token").post(refresh_AccessToken)
 
export default router;