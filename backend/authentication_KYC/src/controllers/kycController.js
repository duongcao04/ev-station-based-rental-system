import { KYCService } from "../services/kycService.js";

export const uploadKYC = async (req, res) => {
  try {
    const profile = await KYCService.updateKYC(req.user.id, req.files);
    res.status(200).json({
      message: "Cập nhật thông tin giấy tờ thành công. Đợi xác thực.",
      profile,
    });
  } catch (error) {
    console.error("Error in uploadKYC", error);
    res.status(500).json({ message: "Internal Error" });
  }
};

export const getKYCStatus = async (req, res) => {
  try {
    const kyc = await KYCService.getKYCStatus(req.user.id);
    res.status(200).json({ kyc });
  } catch (error) {
    console.error("Error in getKYCStatus", error);
    res.status(500).json({ message: "Internal Error" });
  }
};

export const getKYCSubmissions = async (req, res) => {
  try {
    const { status, page = 1, q = "" } = req.query;
    const submissions = await KYCService.getKYCSubmissions({ status, page, q });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error in getKYCStatus", error);
    res.status(500).json({ message: "Internal Error" });
  }
};

export const verifyKYCSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, note_staff } = req.body;
    const staffId = req.user.id;

    const updated = await KYCService.verifyKYCSubmisstion({
      submissionId,
      status,
      note_staff,
      staffId,
    });
    res
      .status(200)
      .json({ message: "Xác thực trạng thái KYC thành công", updated });
  } catch (error) {
    console.error("Error in getKYCStatus", error);
    res.status(500).json({ message: "Internal Error" });
  }
};
