<template>
    <div>
      <el-row>
            <label style='font-size:18px;font-weight:600'>Stake ITT tokens</label>
      </el-row>
      <label class="plan-info">Staking is </label><el-tag v-show='tokenNeeded <= 0' type="success" size='mini'>Active</el-tag>
      <el-tag v-show='tokenNeeded > 0' type="warning" size='mini'>Not active</el-tag>
      
      <el-row style='padding:20px'>
          <label style='font-size:14px'>Get access to the Pro Plan by holding a balance of 10,000 ITT.</label><br/>
          <label style='font-size:12px'>Note: all tokens paid as subscriptions get counted towards your staked balance.</label>
      </el-row>
      <el-row style="padding:20px;">
        <stake-progress :progress='(this.stakingTokensPercentage)' :currentNumber='(this.stakingBalance + this.paidTokens).toFixed(2)' targetNumber='10,000' :neededNumber=tokenNeeded></stake-progress>
      </el-row>
      <el-row style="padding:20px;border-radius: 25px;background: rgba(102, 177, 255, 0.12);">
        <el-col :span=11><i class="fas fa-coins"></i> {{this.stakingBalance}} ITT<br/> <span style='font-size:10px'>staking</span></el-col>
        <el-col :span=2> <span style='font-size:10px'>+</span></el-col>
        <el-col :span=11><i class="fas fa-wallet"></i> {{this.paidTokens.toFixed(2)}} ITT<br/> <span style='font-size:10px'>paid</span></el-col>
      </el-row>
      <el-row  style='margin-top:20px;margin-bottom:20px'>
        <label @click="editAddress" v-show=!editMode style='font-size:10px;font-weight:500; color:cornflowerblue;'>{{this.stakingAddress ? `Staking on ${this.stakingAddress}` : 'Click to add your wallet address.'}} <i class="el-icon-edit"></i></label>
        <el-input v-show=editMode placeholder="0x1fD19a3FB5Ec2D73440B908c8038333aeFAd1e3e4e" v-model="stakingAddress" size="mini"><el-button slot="append" style='color:green' :disabled="this.stakingAddress == ''" icon="el-icon-check" @click="setStakingWallet"></el-button><el-button @click="(editMode=false)" style='color:red' slot="append" :disabled="this.stakingAddress == ''" icon="el-icon-close"></el-button></el-input>
      </el-row>
      <el-row style='margin:20px'>
        <el-button type="primary"  :disabled="this.stakingAddress == '' || !this.stakingAddress || this.editMode" @click="$emit('update:stakingStep', 1)">Sign to verify your address<i class="fas fa-long-arrow-alt-right"></i></el-button>
      </el-row>
    </div>
</template>
<script>
import constant from "../../constant";
import { mapGetters } from "vuex";
import StakeProgress from "./StakeProgress";

export default {
  name: "StakeItt",
  data() {
    return {
      stakingAddress: this.$store.state.settings.staking.walletAddress,
      editMode: false
    };
  },
  computed: {
    ...mapGetters(["paidTokens", "stakingBalance"]),
    tokenNeeded: function() {
      return 10000 - this.stakingBalance - this.paidTokens;
    },
    stakingTokensPercentage: function() {
      return ((this.stakingBalance + this.paidTokens) / 100).toFixed(2);
    }
  },
  components: {
    StakeProgress
  },
  methods: {
    editAddress: function() {
      this.editMode = true;
    },
    setStakingWallet: function() {
      this.$store.dispatch("setStakingWallet", this.stakingAddress).then(() => {
        this.editMode = false;
        this.$notify({
          title: "ITF Staking",
          message: `${this.stakingAddress} set as new staking address.`,
          duration: 0,
          offset: 100,
          type: "success"
        });
      });
    }
  }
};
</script>
<style>
.el-input__inner {
  font-size: 10px;
}
.plan-info {
  font-size: 12px;
}
</style>
