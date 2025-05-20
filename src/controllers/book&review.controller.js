import {Book} from '../models/book.model.js';
import {Review} from '../models/review.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const addBook = asyncHandler( async (req, res, next) => {
    let {title, author, genre} = req.body

    if (
        [title, author, genre].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, `Book details are required`)

    }
    title = title.toLowerCase();
    author = author.toLowerCase();
    genre = genre.toLowerCase();

    const existedBook = await Book.findOne({
        $and: [{title}, {author}]
    })
    if (existedBook) {
        throw new ApiError(409, `Book already exist`)
    }

    const book = await Book.create({
        title,
        author,
        genre
    })

    if (!book) {
        throw new ApiError(500, `Server side error`)
    }

    return new ApiResponse(res, `Book created successfully`, 201, {})



    
})

export const getBooks = asyncHandler( async (req, res, next) => {
    const books = await Book.find();
    
    return new ApiResponse(res, `Books fetched successfully`, 201, books)

})

export const getBook = asyncHandler( async (req, res, next) => {
    const {id} = req.params
    const book = await Book.find({_id: id})

    if (!book) {
        throw new ApiResponse(res, `Book do not exist`)
    }

    return new ApiResponse(res, `Book fetched`, 201, book)
    
})

export const postReview = asyncHandler( async (req, res, next) => {
    const {bookId} = req.params
    const {_id} = req.user
    const {comment} = req.body

    const review = await Review.create({
        bookId,
        comment,
        userId: _id
    })

    if (!review) {
        throw new ApiError(500, `Server side error`)
    }

    return new ApiResponse(res, `Review created successfully`, 201, {})



    
})

export const updateReview = asyncHandler( async (req, res, next) => {
    const {id} = req.params// reviewid
    const {comment} = req.body
    
    const review = await Review.findByIdAndUpdate(
        id,
        {
            $set: {
                comment
            }
        },
        {
            new: true
        }
    )

    if (!review) {
        throw new ApiError(500, `Server side error`)
    }

    return new ApiResponse(res, `Review updated`, 201, review)
    
})

export const deleteReview = asyncHandler( async (req, res, next) => {
    const {id} = req.params// reviewid
    const result = await Review.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new ApiError(400, `Book do not exist`)
    }

    return new ApiError(res, `Review deleted succefully`)
    
})