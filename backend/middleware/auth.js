import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {

        const { token } = req.headers;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized Login Again"
            });
        }

        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.body.userId = token_decode.id;

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error.message);

        return res.json({
            success: false,
            message: "Not Authorized Login Again"
        });
    }
};

export default authUser;