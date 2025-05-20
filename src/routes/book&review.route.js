import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    addBook, 
    deleteReview, 
    getBook, 
    getBooks, 
    postReview,
    updateReview,
} from "../controllers/book&review.controller.js";

const router = Router()
router.route("/").post(verifyJWT, addBook);//
router.route("/").get(getBooks);
router.route("/:id/reviews").post(verifyJWT, postReview)// book id
router.route("/:id").get(getBook)// book id

router.route("/:id").put(updateReview)// review id
router.route("/:id").delete(deleteReview)// review id


 
export default router;