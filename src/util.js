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
    },
    getHighestSubscriptionLevel: function (settings) {

        var levels = {}
        levels.is_ITT_team = settings.is_ITT_team
        levels.isAdvanced = settings.staking && settings.staking.centomila
        levels.isPro = settings.staking && settings.staking.diecimila
        levels.isStarter = -1 * moment().diff(settings.subscriptions.paid, "days") > 0
        levels.isFreePlus = -1 * moment().diff(settings.subscriptions.beta, "days") > 0

        var highestLevel = 'free'
        if (levels.is_ITT_team) highestLevel = 'ITT'
        else if (levels.isAdvanced) highestLevel = 'centomila'
        else if (levels.isPro) highestLevel = 'diecimila'
        else if (levels.isStarter) highestLevel = 'paid'
        else if (levels.isFreePlus) highestLevel = 'beta'
        return highestLevel
    },
    getSignalLabel(signals, indicator) {
        var match = signals.find(s => s.label && s.label == indicator.name);
        return match && match.description ? match.description : indicator.name;
    }
}

