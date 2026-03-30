import { Router } from "express"
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  cancelFriendRequest
} from "../controllers/friendController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/friends/request/:targetUserId", authMiddleware, sendFriendRequest)
router.patch("/friends/accept/:requesterId", authMiddleware, acceptFriendRequest)
router.patch("/friends/reject/:requesterId", authMiddleware, rejectFriendRequest)
router.patch("/friends/cancel/:targetUserId", authMiddleware, cancelFriendRequest)
router.delete("/friends/:friendId", authMiddleware, removeFriend)

export default router