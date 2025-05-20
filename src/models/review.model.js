import mongoose, {Schema} from 'mongoose';

const reviewScheam = new Schema({
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book"
}
})

export const Review = mongoose.model('Review', reviewScheam)