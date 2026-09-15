import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/payments/create-order
 * Creates a payment order for Premium plan or Expert Checkup service.
 * Never stores credit card numbers, CVV, or passwords in the database.
 */
router.post('/create-order', async (req, res) => {
  try {
    const { planType, amountRupees, userId } = req.body;
    const orderId = 'order_sih_' + Date.now();

    res.json({
      success: true,
      orderId,
      amount: amountRupees || 1499,
      currency: 'INR',
      keyId: 'rzp_test_sih_demo_key',
      planType: planType || 'PREMIUM_SUBSCRIPTION',
      isDemoMode: true,
      modeLabel: 'SIH DEMO / TEST PAYMENT',
      message: 'Secure checkout order generated.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/payments/verify-test-payment
 * 1-click test checkout verification for SIH Hackathon presentations.
 * Updates the user's subscription in MongoDB.
 */
router.post(['/verify-test-payment', '/verify-demo'], async (req, res) => {
  try {
    const { orderId, planType, userId } = req.body;

    let updatedUser = null;
    if (userId && userId !== 'guest' && userId !== 'user-default') {
      try {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            plan: 'premium',
            isPremium: true,
            subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          },
          { new: true }
        );
      } catch (err) {
        console.warn('Could not update MongoDB user by ID, proceeding with memory activation:', err.message);
      }
    }

    res.json({
      success: true,
      paymentId: 'pay_test_' + Date.now(),
      orderId: orderId || 'order_sih_' + Date.now(),
      status: 'PAID',
      plan: 'premium',
      isPremium: true,
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      activatedAt: new Date().toISOString(),
      mode: 'SIH_DEMO_TEST_PAYMENT',
      modeLabel: 'SIH DEMO / TEST PAYMENT',
      user: updatedUser,
      message: 'Test payment verified successfully. Premium subscription activated!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
