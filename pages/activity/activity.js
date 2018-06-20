const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'
var images = [
  'http://img8.ontheroadstore.com/upload/180608/5a53db85924183eae60a41c498b81d50.jpg',
  'http://img8.ontheroadstore.com/upload/180608/37ca2e7c01bb5f551293306a9ce4d3b8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/eca9fd36bf608588560542b619528b21.jpg',
  'http://img8.ontheroadstore.com/upload/180608/15198a0f966c0e5437db2c2b6e8ac9d7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/90fc87a250533eec25143603159c21d1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/86d7db8596cfc9027d0a80dd8f07f043.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6750c4665a408ee9ad97f3e612742a72.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5a684b6c32e647ca2ff09224bee55a0a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8ecaee3beee4d8ddf7c3004c22cfbfd0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4aadfcb665b4f724aa3506f8b60874db.jpg',
  'http://img8.ontheroadstore.com/upload/180608/241faddd611854c43b306be3e23d960f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4eb586a02b0f3608794979e9a2b74651.jpg',
  'http://img8.ontheroadstore.com/upload/180608/591dc4524ced871cd9fd2cae5b8d14fd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0ec2ffc94f7e8652046bdf8b4743cbd0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/40171200270af231d6759963fde55d22.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bcdd298ec90169b4f023b5749877a54f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b8a378309fc999cd0ad175e4fd0ca162.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c43b7d4502adaa35895dc13d2d12fa7e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/169c99fbbdef28858214ec1b498e3626.jpg',
  'http://img8.ontheroadstore.com/upload/180608/836ca85a66bcaaca23f4005e53f9daa5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f927b4368ae2cb73b5c034bc53cf72ee.jpg',
  'http://img8.ontheroadstore.com/upload/180608/36c82d91b69a93a64d70f524837d9097.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f141b9207b30832120b6de1217883274.jpg',
  'http://img8.ontheroadstore.com/upload/180608/793afe29629097687348de899af98d0f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6f5120dfd917a1f763c0f99d085367b4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/13dda80eb480af271c011a4f345e5d6a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9ba28040648c5ae8f62bf6b0db94c8b9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5df70d0cb004dfd32a3a909faf400dc7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/14366a5c94efad504f15718fbdab6f56.jpg',
  'http://img8.ontheroadstore.com/upload/180608/680603800cf511936a83429478fa1550.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2550a3265a2c6d04a49b2621ecbb47c5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/57b121cf28b71644fa0e7d772325c3f7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/23d4f27b924118b84d48091a3184ee76.jpg',
  'http://img8.ontheroadstore.com/upload/180608/75a382d3c9f16f4173d68865961ee2c9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bbdc159e0a152ebb22e0da3f2b77452b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/56a0dfc07ecb09600a0034a87e99a1bc.jpg',
  'http://img8.ontheroadstore.com/upload/180608/37f3794d6510a7038469a59452a5f628.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e2702295c285ba229df9a3d637576d5b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7e07d5fa10eb0e226e0b49982ad3f404.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5ae8dd9204942ef22371c720f69b3345.jpg',
  'http://img8.ontheroadstore.com/upload/180608/92bbce9784f9535638fa2bb19a840d08.jpg',
  'http://img8.ontheroadstore.com/upload/180608/932a122050fd14c4029941e5319312ce.jpg',
  'http://img8.ontheroadstore.com/upload/180608/142410fefa297fd403e69e7cf431aa70.jpg',
  'http://img8.ontheroadstore.com/upload/180608/182f4c88be9b6e83120db5c80a8c7330.jpg',
  'http://img8.ontheroadstore.com/upload/180608/94ab1cffadb08ec4a84d017640f1d622.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1ea95156d8c354c002817bfbcc26aebd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ae8d34c3dcc862664d1533dfbfb99f8a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2950f4efc3e524e97472bea2c648dd1f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/a882cf627873159099986d949707b0d0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c5c20ad2f66527c7e0c55a34b4934e93.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2dd90e41641b8be1c3e25edece4544ec.jpg',
  'http://img8.ontheroadstore.com/upload/180608/172008df2c1fe08f63a1ae15d6d27cfd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/aed6d448629ea6306ab50a4d27c9760f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ed7c25df393d13377d1d6ca2beb514d8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f379282b635498f37fdf08d44e981610.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e2fbe3c54e7fc7244ccbdfeb0ae9aea2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c9168899d9e07a8965a0924b9937f2c1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/eac54856ecbeaee90aea51a487ded5bf.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2c5e46cb3a94878b18882bb40f1b2c6f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6d143531e9811996ed4468933e58eb3e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0fc336f2b2e448a52233c1e090a51c1c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5d8e5002863bb25a2cad507ac0b3d76e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/41e05b743d6f27005a1c38c5ff69be69.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2ffcc75ce1c839cb75d722ddb6f8194e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/39eed299823125789650d37edeb73fa2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7d6c46ac48c155f3418b618f5fb6008e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9784148b453d3e905bb34b5526dc001b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/556c7613080b7408e3a421f613869924.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ca0bc11734662e88a0b363dda006d5f1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/73390580e613503c9acc5451f0541a66.jpg',
  'http://img8.ontheroadstore.com/upload/180608/963794a3c22f4bcab05ed804255efc7c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/513d43025d7e50f7ff546d4d81a8f709.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8e8ff295ff971f91f4c54245e394d67e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ae33c258b5e5a5a15ddd3f4ac4d6194d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ec09c3dfc721e8953151d988771647b0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/474aab40dc9c3201b0fa2db37cd800a6.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8d7bbfb3a0ff56f7e703eb72366fa9e2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d54f6e89dbef8575fb66c85ab1dc5da2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8e731362e96fed6eb412493589709bb1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5e86d124775cf0430f51855b9f26eb70.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0d090f2c366520df368eab560735f5f4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6687c19bf2e32ff4db0c00d62f77521b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6e5c9c7409a54099f071059ad9f9ba3b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9526e964349f11e05b336b9bd0d5d13f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0bbf2f1e558c06938eb2d5db86dfdbf8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3b6116b581caee7fea6fe8a093f74d51.jpg',
  'http://img8.ontheroadstore.com/upload/180608/da9d1f4cb51ce0b65fd8e4279ebd39d5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/01673dded450481a2ccfd057716cd77c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ef23bf6e3207f3efb25195c517d5e701.jpg',
  'http://img8.ontheroadstore.com/upload/180608/52bd7dc3352ecbca4ae157e65a40045b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f194e3e51bb8c52741f68b79eb9166ed.jpg',
  'http://img8.ontheroadstore.com/upload/180608/93470d1be7f3bbed5fbdfe83c3f64ad0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6e1730298ddd18918a1ff521169eef58.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ae674ec18a7fb4ea1ca3e87d40b95ccc.jpg',
  'http://img8.ontheroadstore.com/upload/180608/74ec2f1e105efd14ed5ca0ac4d57a681.jpg',
  'http://img8.ontheroadstore.com/upload/180608/832b130a4d012f4007e2de26d6936027.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7fc9e77d687a4670b8c15eb613b50fb4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c891825e9f34fcd24d22ba07e7077106.jpg',
  'http://img8.ontheroadstore.com/upload/180608/814ac2d7b5a0412bb62d5f4fe027c618.jpg',
  'http://img8.ontheroadstore.com/upload/180608/027b2b3aed367691c52c92756f54cd3c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/87a9abd3a50a8fef325eadb8c4b9512b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9e0d533175135a1228b3ff94a5239825.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3e4cbc3b964907cd5e9f2e22ef0caee9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/df979b1b5c6a7ffcc47e3df09003b75f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8a530ef6246fc8cea8d76b43ce8915b1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6ba3e2e98fb4a6d65018a270c1d12a7d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d734ff02ea767a57d77aa1bc8b882e8c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b6626dc328ec3b6358723a68591fc100.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c1c661b755970e44abcba0fff5529943.jpg',
  'http://img8.ontheroadstore.com/upload/180608/935296acb9c3b776a8d115748008f10d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b933864139216d3751926d69313ec663.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e8419cc007c8ea5229a6a362d3613607.jpg',
  'http://img8.ontheroadstore.com/upload/180608/a9f7a1ffeb3b0000cdb783431816ffd4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d5ded18b8cedcf4eb277910de4c17edc.jpg',
  'http://img8.ontheroadstore.com/upload/180608/73cb8ebaac569310e1dbf78715116c34.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7aab66cc31a97623db925d2e4e130adb.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f0dec6fa8b3e03e9a5e0b7de439f7e96.jpg',
  'http://img8.ontheroadstore.com/upload/180608/40579ff7dda62d51df65a247b3b3d2f5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2120de22261a13eba2f75730b235c595.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d504ab06f909775393287322f7ff2f4a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7b9a08a8db7866f22bb079e0a54fb725.jpg',
  'http://img8.ontheroadstore.com/upload/180608/03a33ec9c032649ebc75fd99a260e828.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9f6c36943a097cabf8a1049789d7e91f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7e9b771a69a8af352f0739a5720d0f8e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8b54da0a23fc6520b81653bc09c02269.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5fe76729d84e196a5e0f62f5e33fef43.jpg',
  'http://img8.ontheroadstore.com/upload/180608/14c7d3f7b6762ec393607c6738e961f3.jpg',
  'http://img8.ontheroadstore.com/upload/180608/91b5c541521e8187dbdd75efd84a1521.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1445825f584acf17ff5d39a02245e723.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e2b651d09e574b9596b61b350315fdb4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1163aeaaf0f64c4b78e31999ff5487ca.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8e9bd458d5d0bf78fb2e3b7b78cb3110.jpg',
  'http://img8.ontheroadstore.com/upload/180608/05586e7b2c4e1351fe8a1ef5640d3cb2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/227756c2d687c98e7678158f707ab2c9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d92f5a6b71c063902e3b4a78ec4dab04.jpg',
  'http://img8.ontheroadstore.com/upload/180608/04a4f58cab3e7f1a86ced119a367310a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5c544a4a82e545263c09b2692db61703.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2c45b42754fe01c5337d05008bbd4c74.jpg',
  'http://img8.ontheroadstore.com/upload/180608/90b671ef363367c663fba1424ce739d1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/24cf363ba42e251e3b6156d0c37626af.jpg',
  'http://img8.ontheroadstore.com/upload/180608/949925559aa5346fdab0bbad28a1f2ab.jpg',
  'http://img8.ontheroadstore.com/upload/180608/18c1bccb22ab20a7d961bf10bb98dd5d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3ed2316e052160b7b17f7ce48137528e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/50f94c46597f081c8a2263342e9ae4dd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/796985c9c454d087c563348585ec5e5c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/38e9a252789f601746567f7de0210a08.jpg',
  'http://img8.ontheroadstore.com/upload/180608/47c5a7dc2a5d04d9576d48256a19e403.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8020e5e965a04787b3713bcf8e2c2e41.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6c99164a3a1ee48f732b799070af3df1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/986f23855561d9c8bef1a20e190d3170.jpg',
  'http://img8.ontheroadstore.com/upload/180608/42ad0e7631aeed0fc60d26590478c0ce.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d224f88443fe403c1916c9143fbda200.jpg',
  'http://img8.ontheroadstore.com/upload/180608/35b68e9cd61e5e76bd784a4c521c1820.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7a216ac1fc0c1e93a17055255e7ebfff.jpg',
  'http://img8.ontheroadstore.com/upload/180608/88c21dc36700b7613cd185c4187d0163.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8a1d5c10c200be1d18a870cb48be3d22.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5432d9f32324c52a0b575d6b120d1968.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9fef87e5f6c319e415741eef32bb3f2b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1ba8f476f29319b59133fb4eac673580.jpg',
  'http://img8.ontheroadstore.com/upload/180608/58d0ab57acd14463788326bd4e43acec.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5b1d2f68d27b93e2fd0873e80b225102.jpg',
  'http://img8.ontheroadstore.com/upload/180608/619708d95354b4fb44476cde2894eb03.jpg',
  'http://img8.ontheroadstore.com/upload/180608/dc8adff9b9e1626be5daf746931518e2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0de4894452d25c4a2073e6b37390ea74.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e70f5e5980aed90a906e1eb5958178bc.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3b36be2f420f72f2c122b0d1227e07b5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b5567738edd86af998a7239a065af462.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b968737bfac87daf9311e932753a61b4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/256add7cb916fb693d4d459cd98de50c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/a77ff2eae41df9fde35ee9a6fe322be4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/33c72169b8f22957e420c4d1956d471a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c784dbf28182cac0e8f8f3fb2c6f1f31.jpg',
  'http://img8.ontheroadstore.com/upload/180608/447d86ebcb85e64df81bc63be4bdb0d9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d62d83fdc8382970a7b779d510145554.jpg',
  'http://img8.ontheroadstore.com/upload/180608/fe651fa75ae36749010e9601986c95d8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2d729f27bc0e592d364ea3f02a1161b2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f922cc4cd95038678b5c23ad0300b02c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/96e62a234f7df9559713338dae439e23.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2cddccdc79e9b1f61fabf19a23f1626e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4b7da23950063687955073b08d23ffc8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0bd366443c1d2e0aaf2c14e381016ee5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0fff9153f4dd2403afe1e493b491db78.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0a3e50109f235ed1c5171429ed6bf5f2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/eccd7f7c76e9f06a726a104caf8bc2fa.jpg',
  'http://img8.ontheroadstore.com/upload/180608/75aa53b63579e57fef6cde1689d3edf3.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7b02e60e73ffa82f7ee31f0bad8c2fee.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bff892b59ee1856d9a9e2b6afd633785.jpg',
  'http://img8.ontheroadstore.com/upload/180608/39887988f238747c0a5ea0b033034aa4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d457ce673a5bce904343905fedf09b33.jpg',
  'http://img8.ontheroadstore.com/upload/180608/373d28a3ce36c7074074dd2f1ffdc261.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4b52aa0fae91ed659fe70afe1c76408a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/73fec808d311fb2030e50cc52b937f1e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7b941c07d4005ecb2dbe102a9b8c49b8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7f1a7f86cd71ca5a8bb8e266779e6574.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1f974ebb18be2117a4914f46bca1546b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/cc6a3c4dc805697c422b3cefbaedf5ac.jpg',
  'http://img8.ontheroadstore.com/upload/180608/605643aa9e6d4f06fe7ad782a1851c80.jpg',
  'http://img8.ontheroadstore.com/upload/180608/aa3237a2589c5c1b909306444bc4219f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/089cf17f6b8d13484575a75bba18b479.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c4dd4be4b7593dcef568ecfc8d31e2e7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/53983c378458f33848e20966116e9901.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d2af16da2ce12d729d7ce931aa7498ae.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d2af16da2ce12d729d7ce931aa7498ae.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6774071f0e7dcb4f53181214907e6bc2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/29816f919c7577cf8b55e3d108288da0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0d7b44284428bd73064804db627268fa.jpg',
  'http://img8.ontheroadstore.com/upload/180608/45ad584b04b47afab12152aeebbe80cc.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e25e0b65286fda803a6ee4b28d579a2c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/128c4b327622220eb6360a2045fb7926.jpg',
  'http://img8.ontheroadstore.com/upload/180608/22899c53b7c3a2c85920acf09d40d9e7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/df58ebf02372ce27ac9f88eed3e68665.jpg',
  'http://img8.ontheroadstore.com/upload/180608/efdacebb35f7420e732bd79fa147c26a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6b7e7a104394a804e0e7892a3dc731fe.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1b3fadaa7cd04addceb60fd74001573a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5e74304ffac9b5c39ebd08ce12e2c47e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b5e3838760be0fa5a519b7dd01b6779d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3b7ff086d53b6c0b9eed7ec876e5329d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2f6758483886d1d79fb1d26a4b0b4c34.jpg',
  'http://img8.ontheroadstore.com/upload/180608/979915db646a2db8ce51d4b0705e102f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b71d61e6d4b1b1e956bc852a3aff04ac.jpg',
  'http://img8.ontheroadstore.com/upload/180608/514b5ecc881a167a2296661f3da2db40.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4f1d4b7637ba261e77acb630a524296c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0c2234f19a416ae503d1b5d779e900b1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/577197d78fe09d0d562367a539c45f84.jpg',
  'http://img8.ontheroadstore.com/upload/180608/57287b424f18f11fce346e6511b4dc46.jpg',
  'http://img8.ontheroadstore.com/upload/180608/15f2f3baa9c20dcfa1e4ccca4ed71fa6.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7c0391d6e9657afa5262d8ff794b556a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/da35e10bd3e7eb62da31ba9de048ef19.jpg',
  'http://img8.ontheroadstore.com/upload/180608/fde65840ae28024fd227bce5b026fb6f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0861ff850744cecf498201ef09aa2c13.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c4318124b2b0c4d04c82f65e5b55c1f1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/de725f235be3fdca2145f7a855ab5cae.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1159f87cfd1c55e5e577758888b74d1d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/976d01299181e46755abee7186c4ad53.jpg',
  'http://img8.ontheroadstore.com/upload/180608/971c5912ebb78f6387663b4133513a8d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6e9b790bd7b99059ba41c1f21a5746f7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/775652bfbcdb2582d6c0e26258a351c1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bdf2735dda0cd06ec3c4f4a0d9cfcea5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/a97b242605b57ebf4927c85c9fece94d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1f02109a6a27480263dc2b20d5fc896b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9b8531d8e594a3bd235eabbc76e0ed00.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e1213978e1ee4885200b02f7868625a0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/631537ee7c62afbcfe335fad8a3ddf6b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ffb39a413c76e915b451f149453683fd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e47e0d2cca83edfafed9cc67d5153a01.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6ae6edc60f4b2ace574d18b3326d3e79.jpg',
  'http://img8.ontheroadstore.com/upload/180608/808f169a927bae3baa78f8b4e5c9e67c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/808f169a927bae3baa78f8b4e5c9e67c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1d71633a077fdf474c714cc1cb562bf9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7f5275e95ceccf738b9aa609a554eeb0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c4fe62329e0489d3249ec4d4ea021b8f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/97c96dccfa2ab97a3a6804f8d4b1a262.jpg',
  'http://img8.ontheroadstore.com/upload/180608/cbc054e2e251b7d881e66e58a76d6e9b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/28932b7abc5a11e2cbf4a84942cba023.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ff6b5b7c8f63815316f083430faa7619.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c70daa27e8af2071802e0aa3a642ec1f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0d747f7327b423da35a933b18fd71624.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d6f9150db6a63c4184f186e49c30c0f4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/57a58068b221f16d4958f5d677bc022d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/fd20d49de6ac019ab7b9d2fde07dacd8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f3be1bab8d5ac89addb3485ca67d2642.jpg',
  'http://img8.ontheroadstore.com/upload/180608/56c028c6f33d51088d0129c07bc3d808.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2f6ea9815a50c6469fb7f7ecb1f03310.jpg'
]
Page({
  data: {
    authorization: false,                     // 用户是否授权
    liquorBgSize: {},                         // liquorBg背景缩放尺寸
    liquorBgAnimation: null,                  // 背景动画
    loadingStatic: 0,                         // 加载进度
    progressAnimation: null,                  // 加载进度动画
    loadingSuccess: false,                    // 加载成功
    startingUpStatus: true,                   // 开机界面显示状态
    startAnimation: [],                       // 开始动画图片列表
    startAnimationNum: 0,                     // 动画图片显示顺序
    startAnimationStatus: false,              // 动画进行状态
    dialogGifStatus: false,                   // gif弹窗显示
    combatGifStatus: false,                   // 打斗背景gif
    blowStatus: false,                        // 拳打脚踢按钮显示
    strikeStatus: false,                      // 上下按钮栏
    procedureState: 0,                        // 存档参数
    dialogNum: 0,                             // 弹窗显示
    dialogActive: 0,                          // 当前显示弹窗
    blowNum: 0,                               // 打击次数
    damageNum: 0,                             // 伤害总数
    employCash: 0,                            // 优惠价格
    msgData: null,                            // 打击文案图片
    dialogText5: { title: '腿软了！赶紧叫人吧！'},
    dialogText6: { title: '确认还要打？再打容易出事', subhead1: '打打打打打', subhead2: '不打了挑瓶酒' },
    battlefieldStatus: false,                 // 我的战报显示
    battlefieldReportStatus: false,           // 战报图片
    canvasData: null,                         // 生成战报的信息
    activityInfoStatus: false,                // 活动规则
    winelistStatus: false,                    // 酒单显示
    resetDialogStatus: true,                  // 重置提示窗
    goodsActive: 0,                           // 选中的酒单
    orderDialogStatus: false,                 // 订单提示窗
    goodList: null,                           // 商品列表
    activeGood: null,                         // 选中的商品
    shareUrl: null,                           // 分享地址
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onLoad: function () {
    const that = this
    var onLoad = this.onLoad
    wx.getUserInfo({
      success: function () {
        req(app.globalData.bastUrl, 'wxapp/wine/getStatus', {} ,'GET', true).then(res => {
          // 活动是否到期
          if (res.data) {
          // 根据存档定位用户停留位置
            req(app.globalData.bastUrl, 'wxapp/wine/getStep', {}, 'GET', true, onLoad).then(res => {
              that.setData({
                procedureState: res.data
              })
              that.getInfo()
              that.getShareString()
              if (res.data == 'start') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  dialogNum: 1,
                  dialogActive: 1,
                  startAnimationStatus: true
                })
              } else if (res.data == 'fight') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: true,
                  combatGifStatus: true,
                  dialogNum: 0,
                  dialogActive: 0
                })
              } else if (res.data == 'slienceChooice') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  dialogNum: 9,
                  dialogActive: 9
                })
              } else if (res.data == 'slience') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  winelistStatus: true,
                  dialogNum: 0,
                  dialogActive: 0
                })
              } else if (res.data == 'gameOver') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: true,
                  combatGifStatus: true,
                  dialogNum: 0,
                  dialogActive: 0,
                  dialogText5: { title: '都TM打死了你还鞭尸' }
                })
              } else if (res.data == 'dieChooice') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: false,
                  combatGifStatus: true,
                  dialogNum: 7,
                  dialogActive: 7,
                  dialogText5: { title: '都TM打死了你还鞭尸' }
                })
              } else if (res.data == 'die') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: true,
                  combatGifStatus: true,
                  dialogNum: 0,
                  dialogActive: 0,
                  dialogText5: { title: '都TM打死了你还鞭尸' }
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '活动已结束',
              showCancel: false,
              success: function (data) {
                if (data.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              }
            })
          }
        })
      },
      fail: function () {
        that.setData({
          authorization: true
        })
      }
    })
  },
  onReady: function () {
    // 微信直接加载图片不能超150 大概 显示后在进行添加 且不能直接加载 startAnimation: images
    for (var i = 0; i < 263; i++) {
      var mmm = this.data.startAnimation
      mmm.push(images[i])
      this.setData({
        startAnimation: mmm
      })
    }
  },
  onShow: function () {
    this.bgLoadingProgressBar()
    // 获取酒单信息
    req(app.globalData.bastUrl, 'wxapp/wine/getGoodsInfo', {}, 'GET', true).then(res => {
      console.log(res)
      this.setData({
        goodList: res.data
      })
    })
  },
  // 获取用户 活动信息
  getInfo: function () {
    req(app.globalData.bastUrl, 'wxapp/wine/getInfo', {}, 'GET', true).then(res => {
      this.setData({
        blowNum: res.data.hexagon.justice ? res.data.hexagon.justice : 0,
        damageNum: res.data.hit,
        employCash: res.data.cash
      })
    })
  },
  // 拳打脚踢
  blow: function (e) {
    const blowType = parseInt(e.target.dataset.type)
    const that = this
    // 设置文案
    that.setDialogText5()
    // 超过5次后
    if (that.data.blowNum >= 5 && that.data.procedureState == 'fight') {
      that.setData({
        dialogGifStatus: false,
        dialogNum: 6,
        dialogActive: 6
      })
      return false
    } else if (that.data.blowNum >= 5 && that.data.procedureState != 'fight') {
      that.setData({
        dialogGifStatus: false,
        dialogNum: 5,
        dialogActive: 5
      })
      setTimeout(function(){
        that.setData({
          dialogGifStatus: false,
          blowStatus: true,
          dialogNum: 0,
          dialogActive: 0
        })
      },2000)
      return false
    }
    // 接口获取文字图片信息 blowType 打击类型 
    req(app.globalData.bastUrl, 'wxapp/wine/hit', {
      hitType: blowType
    }, 'POST', true).then(res => {
      if (res.data.status){
        that.setData({
          dialogGifStatus: true,
          blowStatus: false,
          damageNum: 10,
          msgData: {
            img: res.data.msg.img,
            msg: res.data.msg.msg
          }
        })
        setTimeout(function () {
          req(app.globalData.bastUrl, 'wxapp/wine/getInfo', {}, 'GET', true).then(res => {
            that.setData({
              blowNum: res.data.hexagon.justice ? res.data.hexagon.justice : 0,
              damageNum: res.data.hit,
              employCash: res.data.cash
            })
              that.setData({
                dialogGifStatus: false
              })
              if (that.data.blowNum == 1 || that.data.blowNum == 4 || that.data.blowNum == 5) {
                that.setData({
                  blowStatus: true
                })
              } else if (that.data.blowNum == 2) {
                that.setData({
                  dialogNum: 2,
                  dialogActive: 2
                })
              } else if (that.data.blowNum == 3) {
                that.setData({
                  dialogNum: 3,
                  dialogActive: 3
                })
              }
          })
        }, 2000)
      } else{
        that.setData({
          blowStatus: false,
          dialogNum: 5,
          dialogActive: 5
        })
        setTimeout(function () {
          that.setData({
            blowStatus: true,
            dialogNum: 0,
            dialogActive: 0
          })
        }, 2000)
      }
    })
  },
  // 结局
  ending: function (e) {
    const ending = e.target.dataset.ending
    if (ending == 1){
      this.setData({
        procedureState: 'gameOver',
        dialogNum: 0,
        dialogActive: 0,
        blowStatus: true,
        winelistStatus: true
      })
    } else if (ending == 2) {
      this.setData({
        procedureState: 'die',
        dialogNum: 8,
        dialogActive: 8,
      })
      // 游戏结束，领取优惠卷

    } else if (ending == 3){
      this.setData({
        dialogNum: 10,
        dialogActive: 10
      })
    } else if (ending == 4) {
      this.setData({
        dialogNum: 0,
        dialogActive: 0,
        blowStatus: true
      })
    } else if (ending == 5) {
      // 重置游戏
      this.resetGame()
    }
    this.procedure()
  },
  // dialog3 文案切换
  setDialogText5: function () {
    var text = this.data.dialogText5
    if (this.data.blowNum >= 5 && that.data.procedureState == 'die') {
      text = { title: '都TM打死了你还鞭尸' }
    } else {
      text = { title: '腿软了！赶紧叫人吧！' }
    }
    this.setData({
      dialogText5: text
    })
  },
  // dialog6 文案切换
  setDialogText6: function () {
    var text = this.data.dialogText6
    if (text.title == '确认还要打？再打容易出事'){
      text = { title: '善意提醒，再打出现损失后果自负', subhead1: '我知道了别烦', subhead2: '算你厉害不打了' }
    } else if (text.title == '善意提醒，再打出现损失后果自负'){
      text = { title: '酒保瘫倒在地上，再打就出人命了！', subhead1: '偏不！我TM就要搞死你丫的', subhead2: '见好就收，拿奖金买酒' }
    } else if (text.title == '酒保瘫倒在地上，再打就出人命了！'){
      text = { title: '确认还要打？再打容易出事', subhead1: '打打打打打', subhead2: '不打了挑瓶酒' }
      this.setData({
        dialogNum: 7,
        dialogActive: 7,
        procedureState: 'dieChooice'
      })
      this.procedure()
    }
    this.setData({
      dialogText6: text
    })
  },
  // 选择见义勇为
  samaritan: function () {
    this.setData({
      procedureState: 'fight',
      strikeStatus: true,
      blowStatus: true,
      combatGifStatus: true,
      dialogNum: 0,
      dialogActive: 0
    })
    this.procedure()
  },
  // 选择默不作声
  slienceChooice: function () {
    this.setData({
      procedureState: 'slienceChooice',
      dialogNum: 9,
      dialogActive: 9
    })
    this.procedure()
  },
  // 接受贿赂 购买
  slience: function () {
    this.setData({
      procedureState: 'slience',
      dialogNum: 0,
      strikeStatus: true,
      winelistStatus: true,
      dialogActive: 0
    })
    this.procedure()
  },
  // 存档
  procedure: function () {
    console.log(this.data.procedureState)
    req(app.globalData.bastUrl, 'wxapp/wine/saveStep', {
      step: this.data.procedureState
    }, 'POST', true)
  },
  // 选择地址
  selectAddress: function (e) {
    // const status = e.target.dataset.status
    // if (status == 0){

    // }
    // req(app.globalData.bastUrl, 'appv2/defaultaddress', {}).then(res => {
    //   if (res.status == 1) {
    //     this.setData({
    //       addressInfo: res.data
    //     })
    //   }
    // })
  },
  // 打开酒单
  openWinelist: function () {
    this.setData({
      battlefieldStatus: false,
      winelistStatus: true,
      blowStatus: this.data.procedureState == 'slience' ? false : true,
      dialogNum: 0,
      dialogActive: 0
    })
  },
  // 打开战报
  openBattlefield: function () {
    this.setData({
      battlefieldStatus: true,
      winelistStatus: false,
      blowStatus: true,
      dialogNum: 0,
      dialogActive: 0
    })
  },
  closeWinelistBattlefield: function () {
    this.setData({
      winelistStatus: false,
      battlefieldStatus: false
    })
  },
  // 打开战报生成页
  openBattlefieldReport: function (e) {
    const status = e.target.dataset.status
    const that = this
    if (status == 0){
      this.setData({
        battlefieldReportStatus: false
      })
    } else {
      this.setData({
        battlefieldReportStatus: true
      })
      req(app.globalData.bastUrl, 'wxapp/wine/getShareJpeg', {}, 'GET', true).then(res => {
        console.log(res)
        const data = {
          imgUrl1: '/images/canvasBg.png',
          imgUrl2: '/images/help.png',
          imgUrl3: '/images/defraud.png',
          userImgUrl1: 'https://thirdwx.qlogo.cn/mmopen/Hy1aD7zVQ9beaiaCRbbt4aJKc1ia5BialyDL3bMNmeh3ic4hAeaaz8sahUqe62aSgCQcFHu6Nu3nUVaTbshqOEMhX9cNzBDqYCQia/132',
          userImgUrl2: 'https://thirdwx.qlogo.cn/mmopen/Jr43aXouWDh4FLYc1pUCrV5Puiaro3uf4QdKddWgibe2l0ZsYDIYNxDZP8MozM3vZsnDibEK7HvRZgeDXIn90YxfCCOkrgIQn2y/132',
          userImgUrl3: 'https://thirdwx.qlogo.cn/mmopen/vi_32/l0rh6aAjq1RYv5aS9wLtVVJpAkIuuR0NYFPBMAWibSLaeWmcfCKibNFKpoibblJU3ZSyz1wlvDibWFC42wAvMl59VQ/132',
          userImgUrl4: '/images/default_img.png',
          codeImgUrl: res.data,
          text1: '“猫奶奶家的奶酪”一怒之下蹦起来打在酒保膝盖上，酒保受到惊吓，造成1点伤害。',
          text2: '“猫奶奶家的奶酪”一怒之下蹦上，酒保受到惊吓，造成1点伤害。',
          spotArr: [50, 50, 50, 50, 50, 50]
        }
        that.creatCanvas(data)
      })
    }
  },
  // 加载战报信息
  creatCanvas: function (data) {
    wx.showLoading({
      title: '生成中',
      mask: true
    })
    var that = this
    var num = 0
    this.setData({
      canvasData: data
    })
    wx.getImageInfo({
      src: data.imgUrl1,
      success: function (res) {
        getImageInfoSuccess(data.imgUrl1, 'imgUrl1')
      }
    })
    wx.getImageInfo({
      src: data.imgUrl2,
      success: function (res) {
        getImageInfoSuccess(data.imgUrl2, 'imgUrl2')
      }
    })
    wx.getImageInfo({
      src: data.imgUrl3,
      success: function (res) {
        getImageInfoSuccess(data.imgUrl3, 'imgUrl3')
      }
    })
    wx.getImageInfo({
      src: data.userImgUrl1,
      complete: function (res) {
        getImageInfoSuccess(res.path, 'userImgUrl1')
      }
    })
    wx.getImageInfo({
      src: data.userImgUrl2,
      complete: function (res) {
        getImageInfoSuccess(res.path, 'userImgUrl2')
      }
    })
    wx.getImageInfo({
      src: data.userImgUrl3,
      complete: function (res) {
        getImageInfoSuccess(res.path, 'userImgUrl3')
      }
    })
    // 默认用户头像 在获取用户头像失败时使用
    wx.getImageInfo({
      src: data.userImgUrl4,
      success: function (res) {
        getImageInfoSuccess(data.userImgUrl4, 'userImgUrl4')
      }
    })
    wx.getImageInfo({
      src: data.codeImgUrl,
      complete: function (res) {
        getImageInfoSuccess(res.path, 'codeImgUrl')
      }
    })

    function getImageInfoSuccess(path, propertyName) {
      var canvasData = that.data.canvasData
      canvasData[propertyName] = path
      that.setData({
        canvasData: canvasData
      })
      num = num + 1
      that.drawImage(num)
    }
  },
  // 绘制战报
  drawImage: function (num) {
    if(num == 8){
      const systemInfo = wx.getSystemInfoSync()
      const ratio = systemInfo.windowWidth / 375
      wx.hideLoading()
      const canvasData = this.data.canvasData
      // 五角点位置
      var spotArr = canvasData.spotArr
      
      if (!canvasData.userImgUrl1){
        canvasData.userImgUrl1 = canvasData.userImgUrl4
      }
      if (!canvasData.userImgUrl2) {
        canvasData.userImgUrl2 = canvasData.userImgUrl4
      }
      if (!canvasData.userImgUrl3) {
        canvasData.userImgUrl3 = canvasData.userImgUrl4
      }
      var showCanvas = wx.createCanvasContext('showCanvas')
      showCanvas.clearRect(0, 0, 375, 603)
      showCanvas.scale(0.81 * ratio, 0.81 * ratio)
      showCanvas.drawImage(canvasData.imgUrl1, 0, 0, 375, 603)

      var lineToArr1 = [{
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
      }]
      lineToArr1[0].top = parseInt(268 - 122 / 50 * spotArr[0])
      lineToArr1[1].top = parseInt(268 - 59 / 50 * spotArr[1])
      lineToArr1[1].left = parseInt(188 + 104 / 50 * spotArr[1])
      lineToArr1[2].top = parseInt(268 + 62 / 50 * spotArr[2])
      lineToArr1[2].left = parseInt(188 + 104 / 50 * spotArr[2])
      lineToArr1[3].top = parseInt(268 + 122 / 50 * spotArr[3])
      lineToArr1[4].top = parseInt(268 + 62 / 50 * spotArr[4])
      lineToArr1[4].left = parseInt(188 - 106 / 50 * spotArr[4])
      lineToArr1[5].top = parseInt(268 - 59 / 50 * spotArr[5])
      lineToArr1[5].left = parseInt(188 - 106 / 50 * spotArr[5])

      showCanvas.beginPath()
      showCanvas.setStrokeStyle('#DF3C5E')
      showCanvas.setFillStyle('rgba(185,51,83,0.51)')
      showCanvas.setLineJoin('round')
      showCanvas.setLineWidth(2)
      // 默认点showCanvas.moveTo(188, 268)
      // showCanvas.moveTo(188, 144)
      // showCanvas.lineTo(292, 209)
      // showCanvas.lineTo(292, 330)
      // showCanvas.lineTo(188, 390)
      // showCanvas.lineTo(82, 330)
      // showCanvas.lineTo(82, 209)
      showCanvas.moveTo(lineToArr1[0].left, lineToArr1[0].top)
      showCanvas.lineTo(lineToArr1[1].left, lineToArr1[1].top)
      showCanvas.lineTo(lineToArr1[2].left, lineToArr1[2].top)
      showCanvas.lineTo(lineToArr1[3].left, lineToArr1[3].top)
      showCanvas.lineTo(lineToArr1[4].left, lineToArr1[4].top)
      showCanvas.lineTo(lineToArr1[5].left, lineToArr1[5].top)
      showCanvas.closePath()
      showCanvas.fill()
      showCanvas.stroke()
      showCanvas.beginPath()
      showCanvas.stroke()
      showCanvas.draw(true)
      showCanvas.save()
      // 用户头像
      showCanvas.beginPath()
      showCanvas.arc(188, 269, 31, 0, 2 * Math.PI)
      showCanvas.closePath()
      showCanvas.arc(36, 483, 24, 0, 2 * Math.PI)
      showCanvas.closePath()
      showCanvas.arc(337, 551, 24, 0, 2 * Math.PI)
      showCanvas.clip()
      showCanvas.drawImage(canvasData.userImgUrl1, 157, 238, 62, 62)
      showCanvas.drawImage(canvasData.userImgUrl2, 12, 459, 48, 48)
      showCanvas.drawImage(canvasData.userImgUrl3, 313, 527, 48, 48)
      showCanvas.draw(true)
      showCanvas.restore()
      showCanvas.drawImage(canvasData.imgUrl2, 10, 497, 53, 20)
      showCanvas.drawImage(canvasData.imgUrl3, 311, 565, 53, 20)
      showCanvas.drawImage(canvasData.codeImgUrl, 316, 18, 49, 49)
      showCanvas.setFontSize(12)
      showCanvas.setFillStyle("#FFF")
      showCanvas.setTextAlign('left')
      const showCanvastextArr1 = textArr(showCanvas, canvasData.text1)
      const showCanvastextArr2 = textArr(showCanvas, canvasData.text2)
      showCanvas.fillText(showCanvastextArr1[0], 85, 484, 231)
      showCanvas.fillText(showCanvastextArr1[1], 92, 504, 231)
      showCanvas.fillText(showCanvastextArr2[0], 52, 552, 231)
      showCanvas.fillText(showCanvastextArr2[1], 60, 572, 231)
      showCanvas.draw(true)




      var hiddenCanvas = wx.createCanvasContext('hiddenCanvas')
      hiddenCanvas.clearRect(0, 0, 375 * 2, 603 * 2)
      hiddenCanvas.drawImage(canvasData.imgUrl1, 0, 0, 375 * 2, 603 * 2)
      var lineToArr2 = [{
          left: 188 * 2,
          top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
          left: 188 * 2,
          top: 268 * 2
      }]
      lineToArr2[0].top = parseInt(268 - 122 / 50 * spotArr[0]) * 2
      lineToArr2[1].top = parseInt(268 - 59 / 50 * spotArr[1]) * 2
      lineToArr2[1].left = parseInt(188 + 104 / 50 * spotArr[1]) * 2
      lineToArr2[2].top = parseInt(268 + 62 / 50 * spotArr[2]) * 2
      lineToArr2[2].left = parseInt(188 + 104 / 50 * spotArr[2]) * 2
      lineToArr2[3].top = parseInt(268 + 122 / 50 * spotArr[3]) * 2
      lineToArr2[4].top = parseInt(268 + 62 / 50 * spotArr[4]) * 2
      lineToArr2[4].left = parseInt(188 - 106 / 50 * spotArr[4]) * 2
      lineToArr2[5].top = parseInt(268 - 59 / 50 * spotArr[5]) * 2
      lineToArr2[5].left = parseInt(188 - 106 / 50 * spotArr[5]) * 2
      hiddenCanvas.beginPath()
      hiddenCanvas.setStrokeStyle('#DF3C5E')
      hiddenCanvas.setFillStyle('rgba(185,51,83,0.51)')
      hiddenCanvas.setLineJoin('round')
      hiddenCanvas.setLineWidth(2)
      hiddenCanvas.moveTo(lineToArr2[0].left, lineToArr2[0].top)
      hiddenCanvas.lineTo(lineToArr2[1].left, lineToArr2[1].top)
      hiddenCanvas.lineTo(lineToArr2[2].left, lineToArr2[2].top)
      hiddenCanvas.lineTo(lineToArr2[3].left, lineToArr2[3].top)
      hiddenCanvas.lineTo(lineToArr2[4].left, lineToArr2[4].top)
      hiddenCanvas.lineTo(lineToArr2[5].left, lineToArr2[5].top)
      hiddenCanvas.closePath()
      hiddenCanvas.fill()
      hiddenCanvas.stroke()
      hiddenCanvas.beginPath()
      hiddenCanvas.stroke()
      hiddenCanvas.draw(true)
      hiddenCanvas.save()
      // 用户头像
      hiddenCanvas.beginPath()
      hiddenCanvas.arc(188 * 2, 269 * 2, 31 * 2, 0, 2 * Math.PI)
      hiddenCanvas.closePath()
      hiddenCanvas.arc(36 * 2, 483 * 2, 24 * 2, 0, 2 * Math.PI)
      hiddenCanvas.closePath()
      hiddenCanvas.arc(337 * 2, 551 * 2, 24 * 2, 0, 2 * Math.PI)
      hiddenCanvas.clip()
      hiddenCanvas.drawImage(canvasData.userImgUrl1, 157 * 2, 238 * 2, 62 * 2, 62 * 2)
      hiddenCanvas.drawImage(canvasData.userImgUrl2, 12 * 2, 459 * 2, 48 * 2, 48 * 2)
      hiddenCanvas.drawImage(canvasData.userImgUrl3, 313 * 2, 527 * 2, 48 * 2, 48 * 2)
      hiddenCanvas.draw(true)
      hiddenCanvas.restore()
      hiddenCanvas.drawImage(canvasData.imgUrl2, 10 * 2, 497 * 2, 53 * 2, 20 * 2)
      hiddenCanvas.drawImage(canvasData.imgUrl3, 311 * 2, 565 * 2, 53 * 2, 20 * 2)
      hiddenCanvas.drawImage(canvasData.codeImgUrl, 316 * 2, 18 * 2, 49 * 2, 49 * 2)
      hiddenCanvas.setFontSize(24)
      hiddenCanvas.setFillStyle("#FFF")
      hiddenCanvas.setTextAlign('left')
      const hiddenCanvastextArr1 = textArr(showCanvas, canvasData.text1)
      const hiddenCanvastextArr2 = textArr(showCanvas, canvasData.text2)
      hiddenCanvas.fillText(hiddenCanvastextArr1[0], 85 * 2, 484 * 2, 231 * 2)
      hiddenCanvas.fillText(hiddenCanvastextArr1[1], 92 * 2, 504 * 2, 231 * 2)
      hiddenCanvas.fillText(hiddenCanvastextArr2[0], 52 * 2, 552 * 2, 231 * 2)
      hiddenCanvas.fillText(hiddenCanvastextArr2[1], 60 * 2, 572 * 2, 231 * 2)
      hiddenCanvas.draw(true)
    }
  },
  // 保存相册
  preserveImg: function () {
    const that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1206,
      destWidth: 750,
      destHeight: 1206,
      canvasId: 'hiddenCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              battlefieldReportStatus: false
            })
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            
          },
          fail: function (res){
            wx.getSetting({
              success: function (res) {
                console.log(res)
                if (!res.authSetting['scope.writePhotosAlbum']){
                  wx.openSetting()
                }
              }
            })
          }
        })
      }
    })
  },
  // 关闭活动规则
  activityInfo: function (e) {
    const status = e.target.dataset.status
    if (status == 0){
      this.setData({
        activityInfoStatus: false
      })
    } else {
      this.setData({
        activityInfoStatus: true
      })
    }
  },
  // 重置提示窗显示
  resetGameShow: function (e) {
    const status = e.target.dataset.status
    if (status == 1){
      this.setData({
        resetDialogStatus: false,
        blowStatus: false,
        dialogNum: 0
      })
    } else {
      this.setData({
        resetDialogStatus: true,
        blowStatus: this.data.dialogActive == 0 && this.data.procedureState != 'slience' ? true : false,
        dialogNum: this.data.dialogActive
      })
    }
  },
  // 重置游戏
  resetGame: function () {
    const that = this
    req(app.globalData.bastUrl, 'wxapp/wine/replay', {}, 'GET').then(res => {
      console.log(res)
      that.setData({
        liquorBgSize: {},
        liquorBgAnimation: null,
        loadingStatic: 0,
        progressAnimation: null,
        loadingSuccess: false,
        startingUpStatus: true,
        startAnimationNum: 0,
        startAnimationStatus: false,
        dialogGifStatus: false,
        blowStatus: false,
        combatGifStatus: false,
        strikeStatus: false,
        procedureState: 0,
        dialogNum: 0,
        dialogActive: 0,
        blowNum: 0,
        damageNum: 0,
        employCash: 0,
        msgData: null,
        dialogText5: { title: '腿软了！赶紧叫人吧！' },
        dialogText6: { title: '确认还要打？再打容易出事', subhead1: '打打打打打', subhead2: '不打了挑瓶酒' },
        battlefieldStatus: false,
        battlefieldReportStatus: false,
        activityInfoStatus: false,
        canvasData: null,
        winelistStatus: false,
        orderDialogStatus: false,
        goodsActive: 0,
        goodList: null,
        activeGood: null,
        resetDialogStatus: true
      })
      that.bgLoadingProgressBar('reset')
    })
  },
  // 活动开始
  startActivity: function () {
    const that = this
    this.setData({
      startingUpStatus: false
    })
    var time = setInterval(function () {
      if (that.data.startAnimationNum <= 263){
        that.setData({
          startAnimationNum: that.data.startAnimationNum + 1
        })
      }else{
        clearInterval(time)
        // 点击开始则 开始记录
        that.setData({
          dialogNum: 1,
          dialogActive: 1,
          startAnimationStatus: true,
          procedureState: 'start'
        })
        that.procedure()
      }
    }, 40)
  },
  // 背景移动动画
  bgLoadingProgressBar: function (reset) {
    // 背景跟着一起动， 加载动画2s以上 背景只持续2s
    const liquorBgAnimation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear'
    })
    liquorBgAnimation.right(0).step()

    const progressAnimation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear'
    })
    progressAnimation.width('366rpx').step()
    this.setData({
      liquorBgAnimation: liquorBgAnimation.export(),
      progressAnimation: progressAnimation.export()
    })
    if (reset){
      var that = this
      setTimeout(function () {
        that.setData({
          loadingSuccess: true
        })
      }, 3000)
    } else {
      var that = this
      setTimeout(function () {
        if (that.data.loadingStatic >= 263) {
          that.setData({
            loadingSuccess: true
          })
        } else {
          setTimeout(function () {
            that.setData({
              loadingSuccess: true
            })
          }, 2000)
        }
      }, 3600)
    }
    
  },
  // 资源加载
  loadStatic: function (res) {
    var loadingStatic = this.data.loadingStatic + 1
    this.setData({
      loadingStatic: loadingStatic
    })
  },
  // 授权
  getuserinfo: function (res) {
    const that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        authorization: false
      })
      app.login(that.onLoad)
    }
  },
  // 商品切换
  tabGoods: function (e) {
    const active = e.target.dataset.active
    this.setData({
      goodsActive: active
    })
  },
  // 获取分享hash
  getShareString: function () {
    const that = this
    req(app.globalData.bastUrl, 'wxapp/wine/getShareString', {}, 'GET', true).then(res => {
      that.setData({
        shareUrl: '/pages/activityShare/activityShare?share=' + res.data
      })
    })
  },
  // 分享 默认分享是活动页 如果当前用户已经可以叫人代打 分享代打页
  onShareAppMessage: function () {
    this.setData({
      dialogNum: 0,
      dialogActive: 0,
      blowStatus: true
    })
    this.addShareIncrCoin()
    // 在分享前生成哈希 在已经打完第三次 最好是每次打击都返回 前2次为null 3次后有哈希值
    return {
      title: '狠货天天抽，最高价值¥2399，次数上不封顶',
      path: this.data.shareUrl,
      imageUrl: 'http://img8.ontheroadstore.com/upload/180528/3b7b4161ab2690f9fe8b10188cbedeff.png'
    }
  },
  // 分享增加抽奖
  addShareIncrCoin: function () {
    const that = this
    if (that.data.blowNum == 4 && that.data.blowNum == 3) {
      req(app.globalData.bastUrl, 'wxapp/wine/share', {}, 'GET', true).then(res => {
        that.setData({
          dialogNum: 4,
          dialogActive: 4,
          blowStatus: false
        })
        setTimeout(function () {
          that.setData({
            dialogNum: 0,
            dialogActive: 0,
            blowStatus: true
          })
        }, 2000)
      })
    }
  },
  catchtouchmove: function () {
    // console.log(1)
  }
})

function textArr(context, text){
  var text1 = text
  var chr = text1.split("")
  var temp = ""
  var row = []
  for (var a = 0; a < chr.length; a++) {
    if (context.measureText(temp).width < 231) {
      temp += chr[a]
    }
    else {
      row.push(temp)
      temp = ""
    }
  }
  row.push(temp)
  if (row.length == 1){
    row.push('')
  } else if (row.length == 3){
    row[2] = ''
  }
  return row
}
