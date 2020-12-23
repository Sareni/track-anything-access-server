const PLANS = Object.freeze({
    BASIC: 'basic',
    STANDARD: 'standard',
    PREMIUM: 'premium'
});

const PLAN_PROPERTIES = {
    basic: {
        label: 'Basic',
        msBetweenTracks: 60000,
        trackAmount: 2,
    },
    standard: {
        label: 'Standard',
        msBetweenTracks: 10000,
        trackAmount: 5
    },
    premium: {
        label: 'Premium',
        msBetwennTracks: 1000,
        trackAmount: 5000
    }
}

module.exports = {
    PLANS,
    PLAN_PROPERTIES
}