import moment from 'moment'

export default {
    subscription: function (settings) {
        if (settings && settings.subscriptions) {
            var paidDaysLeft =
                -1 *
                moment().diff(settings.subscriptions.paid, "days");
            var betaDaysLeft =
                -1 *
                moment().diff(settings.subscriptions.beta, "days");
            return paidDaysLeft > 0
                ? { plan: "Starter", daysLeft: paidDaysLeft }
                : betaDaysLeft > 0 ? { plan: "FREE+", daysLeft: betaDaysLeft } : { plan: "FREE", daysLeft: 'Not expiring' };
        }

        return { plan: 'Loading...', daysLeft: '0' }
    }
}

