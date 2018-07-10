import moment from 'moment'

export default {
    subscription: function (settings) {
        if (settings && settings.subscriptions) {

            if (settings.is_ITT_team)
                return { plan: "Starter (ITF Team)", daysLeft: '∞' }

            var paidDaysLeft =
                Math.max(-1 * moment().diff(settings.subscriptions.paid, "days"), 0);
            var betaDaysLeft =
                Math.max(-1 * moment().diff(settings.subscriptions.beta, "days"), 0);

            return paidDaysLeft > 0
                ? { plan: "Starter", daysLeft: paidDaysLeft }
                : betaDaysLeft > 0 ? { plan: "FREE+", daysLeft: betaDaysLeft } : { plan: "FREE", daysLeft: '∞' };
        }

        return { plan: 'Loading...', daysLeft: '0' }
    }
}

