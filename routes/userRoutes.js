const express = require("express");
const {
  registerUser,
  authUser,
  getUserById,
  fcmToken,
  updateProfileHandler,
  changePassword,
} = require("../controllers/userControllers");
const {
  bloodRequestHandler,
  bloodDonationHandler,
  deleteBloodRequest,
  updateBloodRequest,
  getUserByBloodGroup,
  deleteBloodDonation,
  updateBloodDonationRequest,
  getBloodNotification,
  countUnseenNotifications,
  markNotificationsAsSeen,
  deleteAllNotification,
} = require("../controllers/bloodControllers");
const {
  serviceRequestHandler,
  serviceDonateHandler,
  deleteServiceRequest,
} = require("../controllers/serviceControllers");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(authUser);
router.route("/change-password").put(changePassword);
router.route("/fcmToken/:user_id").put(fcmToken); //new
router.route("/profile-update/:userId").put(updateProfileHandler); //new
router.get("/get-user-by-id/:user_id", getUserById); //new
router.route("/bloodrequest").post(bloodRequestHandler);
router.route("/blood-request-delete/:key").delete(deleteBloodRequest);
router.route("/blooddonation").post(bloodDonationHandler);
router.route("/blood-donation-update/:user_id").put(updateBloodDonationRequest);
router.route("/delete-blood-donation/:key").delete(deleteBloodDonation);
router.route("/get-user-by-bg/:blood_group").get(getUserByBloodGroup);
router.route("/blood-req-update/:user_id").put(updateBloodRequest);
router.route("/servicerequest").post(serviceRequestHandler);
router.delete("/service-request-delete", deleteServiceRequest); //new
router.route("/servicedonate").post(serviceDonateHandler);
router.route("/get-blood-notification/:receiverId").get(getBloodNotification);
router.route("/get-unseen-notification").get(countUnseenNotifications);
router.route("/set-notification-seen/:receiverId").put(markNotificationsAsSeen);
router.route("/delete-notification/:receiverId").delete(deleteAllNotification);
module.exports = router;
