<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Staking setup Result</label>
        </el-row>
        <el-row style='text-align:center'>
            <i v-show="stakingResult.verified" class="fas fa-coins paymentok"></i>
            <i v-show="!stakingResult.verified" class="fas fa-frown paymentko"></i>
         </el-row>
         <el-row style='text-align:center'>
            <label>{{stakingResult.verified?'Success!':'Unsuccessful'}}</label>
         </el-row>
         <el-row style='text-align:center;word-break: break-all;font-size: medium;'>
            <label>{{stakingResult.verified?'': 'Something went wrong. Double check your address and be sure the signature is correct.'}}</label>
         </el-row>
         <el-row v-show="stakingResult.success" style='text-align:center'>
            Your staking address is setup correctly!
         </el-row>
         <el-row style="padding:20px">
         <el-button type="primary" :disabled=this.refreshing @click="goHome">{{reloadText}}</el-button>
         </el-row>
    </div>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";

export default {
  name: "StakingDone",
  props: ["payload"],
  data() {
    return {
      refreshing: false,
      reloadText: "Home"
    };
  },
  computed: {
    stakingResult: function() {
      var stakingResult = JSON.parse(this.$props.payload);
      return stakingResult;
    }
  },
  methods: {
    goHome: function() {
      this.refreshing = true;
      this.reloadText = 'Redirecting...'
      this.$router.go("Main");
    }
  }
};
</script>
<style>
.paymentok {
  font-size: 70px;
  color: lightseagreen;
  padding: 40px;
  margin: 20px;
  border: lightseagreen solid 2px;
  border-radius: 100%;
}
.paymentko {
  font-size: 70px;
  color: lightcoral;
  padding: 40px;
  margin: 20px;
}
</style>
