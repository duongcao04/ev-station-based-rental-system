// Cho phép role đến từ header khi mock (ưu tiên header nếu có)
const mockUsers = {
    "1001": { id: "1001", role: "renter", name: "John Doe" },
    "1002": { id: "1002", role: "staff", name: "Jane Staff" },
    "1003": { id: "1003", role: "admin", name: "Admin User" },
    "1004": { id: "1004", role: "staff", name: "Another Staff" }
};

export const authenticate = (req, res, next) => {
    const userId = String(req.headers["x-user-id"] || "");
    if (!userId) return res.status(401).json({ error: "x-user-id required" });

    const requestedRole = String(req.headers["x-role"] || "").toLowerCase();
    const baseUser = mockUsers[userId] || { id: userId, role: "renter", name: "Mock User" };
    const validRoles = ["renter", "staff", "admin"];
    const role = validRoles.includes(requestedRole) ? requestedRole : baseUser.role;

    req.user = { id: String(baseUser.id), role, name: baseUser.name };
    next();
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Authentication required" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions", required: allowedRoles, current: req.user.role });
        }
        next();
    };
};

export const ensureStationOwnership = (req, res, next) => {
    const isAdmin = req.user?.role === "admin";
    const isStaff = req.user?.role === "staff";
    if (!isStaff && !isAdmin) return res.status(403).json({ error: "Only staff/admin can modify stations" });

    if (isAdmin) return next();

    const targetUserId = String(req.params.user_id ?? req.body.user_id ?? "");
    if (!targetUserId) return res.status(400).json({ error: "user_id is required" });
    if (targetUserId !== String(req.user.id)) {
        return res.status(403).json({ error: "You can only modify your own station" });
    }
    next();
};