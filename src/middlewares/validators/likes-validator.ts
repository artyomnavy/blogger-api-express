import {inputModelValidation} from "../inputModel/input-model-validation";
import {body} from "express-validator";
import {likesStatuses} from "../../utils";

const likeValidation = body('likeStatus')
    .isString()
    .trim()
    .isLength({min: 4})
    .withMessage('Invalid like status')
    .custom(async (likeStatus) => {
        if (likeStatus === likesStatuses.none ||
            likeStatus === likesStatuses.like ||
            likeStatus === likesStatuses.dislike) {
            return true
        } else {
            throw new Error('Invalid like status')
        }
    })
export const likeStatusValidation = () => [likeValidation, inputModelValidation]