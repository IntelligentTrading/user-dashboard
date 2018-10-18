<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Stake ITT</label>
        </el-row>
        <el-row>
            <label style='font-size:10px;font-weight:200'>{{this.stakingAddress ? `Staking on ${this.stakingAddress}` : 'No staking address set.'}}</label>
        </el-row>
          <br/>
          <div class="block">
        <el-row class=flexrow  style="margin-top:10px;">
              <div class=crownico >
                  <i class="fas fa-chess-rook"></i>
              </div>
              <div class="pricing-col">
                <label class="plan-info">Pro</label><el-tag v-show='tokenNeeded <= 0' type="success" size='mini'>Active</el-tag>
                <el-tag v-show='tokenNeeded > 0' type="warning" size='mini'>Not active</el-tag>
                <br/>
                <label class="plan-info-sub">{{(this.stakingBalance + this.paidTokens).toFixed(2)}} ITT</label>
                <br/>
                <label class="pricing-subtitle">{{Math.abs(tokenNeeded.toFixed(2))}} {{tokenNeeded >= 0 ? 'ITT tokens needed' : 'ITT tokens spendable'}}.</label>
              </div>
        </el-row>
        <el-row style='padding:20px'>
                <i class="fas fa-coins"></i> {{this.stakingBalance}} +
                <i class="fas fa-wallet"></i> {{this.paidTokens.toFixed(2)}}
        </el-row>
        <el-row style='padding:20px'>
          <el-alert title="" type="info" description="A total amount of 10K ITT tokens paid for subscriptions will give you lifetime Pro access without the need of staking your tokens." show-icon :closable=false></el-alert>
        </el-row>
  </div>
          <br/>
        <el-button type="primary" @click="$emit('update:stakingStep', 1)">Setup your staking <i class="fas fa-long-arrow-alt-right"></i></el-button>
    </div>
</template>
<script>
import constant from "../../constant";
import { mapGetters } from "vuex";

export default {
  name: "StakeItt",
  data() {
    return {
      stakingAddress: this.$store.state.settings.staking.walletAddress
    };
  },
  computed: {
    ...mapGetters(["paidTokens", "stakingBalance"]),
    tokenNeeded: function() {
      return 10000 - this.stakingBalance - this.paidTokens;
    }
  },
  methods: {}
};
</script>
<style>
.plan-info {
  font-size: 16px;
  font-weight: 600;
}
.plan-info-sub {
  font-size: 16px;
}
.pricing-col {
  text-align: left;
  border-left: black 1px solid;
  padding-left: 10px;
}

.pricing-info {
  font-size: 16px;
  padding: 0px;
  margin: 0px;
}

.flexrow {
  margin-top: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.crownico {
  text-align: right;
  padding: 10px;
  font-size: 32px;
  max-width: 50%;
}

.el-carousel__button {
  background-color: cornflowerblue;
  margin: 2px;
}

.pricing-subtitle-green {
  color: green;
  margin-top: 2px;
  font-size: 10px;
}
</style>
