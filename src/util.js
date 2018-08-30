import moment from 'moment'

export default {
    subscription: function (settings) {

        if (!settings)
            return { plan: 'Loading...', daysLeft: '0' }

        if (settings.is_ITT_team)
            return { plan: "Advanced (ITF Team)", daysLeft: '∞' }

        if (settings.staking) {
            if (settings.staking.centomila) return { plan: "Advanced", daysLeft: '∞' }
            if (settings.staking.diecimila) return { plan: "Pro", daysLeft: '∞' }
        }

        if (settings.subscriptions) {
            var paidDaysLeft =
                Math.max(-1 * moment().diff(settings.subscriptions.paid, "days"), 0);
            var betaDaysLeft =
                Math.max(-1 * moment().diff(settings.subscriptions.beta, "days"), 0);

            return paidDaysLeft > 0
                ? { plan: "Starter", daysLeft: paidDaysLeft }
                : betaDaysLeft > 0 ? { plan: "FREE+", daysLeft: betaDaysLeft } : { plan: "FREE", daysLeft: '∞' };
        }
    }
}

