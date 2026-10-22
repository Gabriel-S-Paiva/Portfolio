export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
      return next(missingFieldError(["refreshToken"]));
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (error) {
      return next(unauthorizedError("Invalid or expired refresh token"));
    }

    const storedToken = await RefreshTokens.findOne({
      token: incomingRefreshToken,
    });

    if (!storedToken) {
      return next(unauthorizedError("Refresh token not found"));
    }

    if (storedToken.revoked) {
      // Reuse of a revoked token: revoke the entire family to protect against theft.
      await RefreshTokens.updateMany(
        {
          tokenFamily: storedToken.tokenFamily,
          entidade_nif_nipc: storedToken.entidade_nif_nipc,
        },
        { revoked: true, revokedAt: new Date() },
      );
      return next(
        unauthorizedError(
          "Token reuse detected. All tokens have been revoked. Please login again.",
        ),
      );
    }

    if (new Date() > storedToken.expiresAt) {
      return next(unauthorizedError("Refresh token has expired"));
    }

    const entity = await Entities.findByPk(decoded.nif_nipc);
    if (!entity) {
      return next(unauthorizedError("User not found"));
    }

    if (entity.blocked) {
      return next(forbiddenError(entity.reason || "Account suspended"));
    }

    const payload = {
      nif_nipc: entity.nif_nipc,
      email_login: entity.email_login,
      role: entity.role,
    };

    const newAccessToken = generateToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await RefreshTokens.findByIdAndUpdate(storedToken._id, {
      revoked: true,
      revokedAt: new Date(),
    });

    // New token inherits the same familyId so reuse can be detected across rotations.
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshTokens.create({
      entidade_nif_nipc: entity.nif_nipc,
      token: newRefreshToken,
      tokenFamily: storedToken.tokenFamily,
      expiresAt,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900, // 15 minutes in seconds
      refreshExpiresIn: 604800, // 7 days in seconds
      tokenType: "Bearer",
    });
  } catch (error) {
    next(genericError("Error refreshing token: " + error.message));
  }
};
