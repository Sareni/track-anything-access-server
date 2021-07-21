const PLANS = Object.freeze({
    BASIC: 'basic',
    STANDARD: 'standard',
    PREMIUM: 'premium',
    ADMIN: 'admin'
});

const PLAN_PROPERTIES = {
    basic: {
        label: 'Basic',
        msBetweenTracks: 1000,
        trackAmount: 500,
    },
    standard: {
        label: 'Standard',
        msBetweenTracks: 1000,
        trackAmount: 2000
    },
    premium: {
        label: 'Premium',
        msBetwennTracks: 0,
        trackAmount: 8000
    },
    admin: {
        label: 'Admin',
        msBetwennTracks: 0,
        trackAmount: 1000000000
    }
}

module.exports = {
    PLANS,
    PLAN_PROPERTIES
}