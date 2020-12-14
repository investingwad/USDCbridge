(this["webpackJsonpusdc-stake"]=this["webpackJsonpusdc-stake"]||[]).push([[0],{251:function(e,t,n){},264:function(e,t){},287:function(e,t){},289:function(e,t){},366:function(e,t){},368:function(e,t){},400:function(e,t){},405:function(e,t){},407:function(e,t){},414:function(e,t){},427:function(e,t){},508:function(e,t,n){"use strict";n.r(t);var a=n(13),i=n(2),u=n.n(i),p=n(239),s=n.n(p),o=(n(251),n(29)),y=n.n(o),r=n(147),l=n(150),m=n(148),c=n(55),d=n(112),b=[{inputs:[{internalType:"uint256",name:"_initialAmount",type:"uint256"},{internalType:"string",name:"_tokenName",type:"string"},{internalType:"uint8",name:"_decimalUnits",type:"uint8"},{internalType:"string",name:"_tokenSymbol",type:"string"}],payable:!1,stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"spender",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Transfer",type:"event"},{constant:!1,inputs:[{internalType:"address",name:"_owner",type:"address"},{internalType:"uint256",name:"value",type:"uint256"}],name:"allocateTo",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"",type:"address"},{internalType:"address",name:"",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"_spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"dst",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transfer",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"src",type:"address"},{internalType:"address",name:"dst",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transferFrom",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],T="0x36423829Da60A46Ede371eFb4451787e8AFC2EBc",f=new m(m.givenProvider),_=d.b().shape({value:d.a().required("Enter value of token").test("lowAmount","Should be greater than 0",(function(e){return parseInt(e)>0})),token:d.c().required("Select a token type")}),v={value:"",token:"USDC"},h=new f.eth.Contract(b,"0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C"),w=new f.eth.Contract(b,"0xaD6D458402F60fD3Bd25163575031ACDce07538D"),x=new f.eth.Contract([{anonymous:!1,inputs:[{indexed:!1,internalType:"bytes",name:"reason",type:"bytes"}],name:"Failure",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"recipient",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"},{indexed:!1,internalType:"bytes",name:"reason",type:"bytes"}],name:"Receipt",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"address",name:"recipient",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"},{indexed:!1,internalType:"bytes",name:"reason",type:"bytes"}],name:"Refund",type:"event"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"acceptTokenOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"addGasSome",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_token_address",type:"address"},{internalType:"uint256",name:"_max_mint_period_amount",type:"uint256"},{internalType:"uint256",name:"_max_mint_period",type:"uint256"},{internalType:"uint256",name:"_max_mint_allowed",type:"uint256"},{internalType:"uint256",name:"_EOS_precision",type:"uint256"},{internalType:"uint256",name:"_ethereum_precision",type:"uint256"}],name:"addNewToken",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"addOwner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approvePoolBalance",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"available_batch_id",outputs:[{internalType:"uint64",name:"",type:"uint64"}],stateMutability:"view",type:"function"},{inputs:[],name:"available_message_id",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint64",name:"",type:"uint64"}],name:"batches",outputs:[{internalType:"uint256",name:"id",type:"uint256"},{internalType:"bytes",name:"message",type:"bytes"},{internalType:"uint256",name:"block_num",type:"uint256"},{internalType:"bool",name:"received",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"changeLockByOwner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"claimGas",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"configs",outputs:[{internalType:"uint256",name:"max_mint_allowed",type:"uint256"},{internalType:"uint256",name:"max_mint_period_amount",type:"uint256"},{internalType:"uint256",name:"max_mint_period",type:"uint256"},{internalType:"uint256",name:"EOS_precision",type:"uint256"},{internalType:"uint256",name:"ethereum_precision",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"depositors",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"",type:"bytes32"}],name:"executedMsg",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"gas_used",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint64",name:"batch_id",type:"uint64"}],name:"getBatch",outputs:[{internalType:"uint256",name:"id",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"},{internalType:"uint256",name:"block_num",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"",type:"bytes32"},{internalType:"address",name:"",type:"address"}],name:"hasConfirmed",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"inbound",outputs:[{internalType:"bytes",name:"message",type:"bytes"},{internalType:"uint256",name:"block_num",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address[]",name:"_owners",type:"address[]"},{internalType:"uint8",name:"_required",type:"uint8"},{internalType:"uint8",name:"_required_secure",type:"uint8"},{internalType:"address[]",name:"_token_contracts",type:"address[]"},{internalType:"uint256[]",name:"_EOS_precision",type:"uint256[]"},{internalType:"uint256[]",name:"_ethereum_precision",type:"uint256[]"},{internalType:"address",name:"_uniswapRouter",type:"address"},{internalType:"uint256[]",name:"_max_mint_period_amount",type:"uint256[]"},{internalType:"uint256[]",name:"_max_mint_period",type:"uint256[]"},{internalType:"uint256[]",name:"_max_mint_allowed",type:"uint256[]"},{internalType:"uint256",name:"_min_eth_required",type:"uint256"}],name:"initialize",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"isOwner",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"last_incoming_batch_block_num",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"last_mint_time",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"last_outgoing_batch_block_num",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"locked",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"min_eth_required",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"},{internalType:"address[]",name:"_owners",type:"address[]"},{internalType:"uint256",name:"required",type:"uint256"}],name:"modifyConsensus",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"msg_types",outputs:[{internalType:"uint64",name:"address_registered",type:"uint64"},{internalType:"uint64",name:"address_modified",type:"uint64"},{internalType:"uint64",name:"mint",type:"uint64"},{internalType:"uint64",name:"deposit",type:"uint64"},{internalType:"uint64",name:"lock",type:"uint64"},{internalType:"uint64",name:"max_mint",type:"uint64"},{internalType:"uint64",name:"min_eth",type:"uint64"},{internalType:"uint64",name:"low_eth",type:"uint64"},{internalType:"uint64",name:"eth_received",type:"uint64"},{internalType:"uint64",name:"swap",type:"uint64"},{internalType:"uint64",name:"max_mint_period_amount",type:"uint64"},{internalType:"uint64",name:"max_mint_period",type:"uint64"}],stateMutability:"view",type:"function"},{inputs:[],name:"next_incoming_batch_id",outputs:[{internalType:"uint64",name:"",type:"uint64"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"",type:"bytes32"}],name:"numOfConfirmed",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"outbound",outputs:[{internalType:"uint64",name:"",type:"uint64"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"},{internalType:"bytes",name:"_message",type:"bytes"}],name:"pushInboundMessage",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"required_sigs",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"required_sigs_secure",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address payable",name:"account",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"sendEther",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"amount",type:"uint256"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"sendToken",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"tokens",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"total_period_mint",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"total_tokens",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"uniswapRouter",outputs:[{internalType:"contract UniswapV2Router02",name:"",type:"address"}],stateMutability:"view",type:"function"},{stateMutability:"payable",type:"receive"}],T),g=function(){var e=Object(i.useState)(""),t=Object(l.a)(e,2),n=t[0],u=t[1],p=Object(i.useState)(""),s=Object(l.a)(p,2),o=s[0],m=s[1],d=function(){var e=Object(r.a)(y.a.mark((function e(){var t,n,a;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,console.log("connecting to metamask"),t=window,n=t.ethereum,console.log("ethereum ",n),"0x3"!==n.chainId){e.next=13;break}if(!n){e.next=11;break}return e.next=9,n.request({method:"eth_requestAccounts"});case 9:a=e.sent,u(a[0]);case 11:e.next=14;break;case 13:alert("Please select Ropsten test network then connect");case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(0),console.log("something went wrong ",e.t0);case 19:case"end":return e.stop()}}),e,null,[[0,16]])})));return function(){return e.apply(this,arguments)}}(),b=function(){var e=Object(r.a)(y.a.mark((function e(t){var a,i,u,p,s;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("values ",t),n){e.next=4;break}return alert("Please connect to metamask first"),e.abrupt("return");case 4:return a=t.value,i=t.token,console.log("value ",a),e.next=8,f.eth.getGasPrice();case 8:u=e.sent,p="USDC"===i?0:1,s="USDC"===i?h:w,m(!0),s.methods.approve(T,a).send({from:n,gas:45e4,gasPrice:u}).on("transactionHash",(function(e){console.log("transactionHash approve ",e)})).on("receipt",(function(e){console.log("receipt approve",e)})).on("confirmation",(function(e,t){console.log("confirmationNumber approve",e),console.log("receipt approve",t)})).on("error",(function(e){console.log("error approve",e),m(!1)})).then((function(){x.methods.sendToken(parseInt(a),p).send({from:n,gas:45e4,gasPrice:u}).on("transactionHash",(function(e){console.log("transactionHash  sendToken",e)})).on("receipt",(function(e){console.log("receipt sendToken",e),m(!1)})).on("confirmation",(function(e,t){console.log("confirmationNumber sendToken",e),console.log("receipt sendToken",t)})).on("error",(function(e){console.log("error sendToken",e),m(!1)}))}));case 13:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(a.jsxs)("div",{className:"form-container",children:[Object(a.jsx)("button",{onClick:d,children:n?"Connected":"Connect to metamask"}),Object(a.jsx)("div",{children:Object(a.jsx)(c.d,{initialValues:v,validationSchema:_,onSubmit:b,children:Object(a.jsxs)(c.c,{children:[Object(a.jsx)("div",{children:Object(a.jsx)(c.b,{name:"value",placeholder:"enter amount"})}),Object(a.jsx)("div",{children:Object(a.jsx)(c.a,{name:"value"})}),Object(a.jsx)("div",{children:Object(a.jsxs)(c.b,{as:"select",name:"token",children:[Object(a.jsx)("option",{value:"USDC",children:"USDC"}),Object(a.jsx)("option",{value:"DAI",children:"DAI"})]})}),Object(a.jsx)("div",{children:Object(a.jsx)(c.a,{name:"token"})}),Object(a.jsx)("div",{children:Object(a.jsx)("button",{type:"submit",className:"submit-btn",disabled:o,children:o?"Sending Token":"Send Token"})})]})})}),Object(a.jsx)("a",{href:"https://docs.google.com/document/u/1/d/14K6_DT-pqmBsAd3tLoHD-SKhPO1WCFW7unMKTMzxKx4/edit?usp=sharing",target:"_blank",children:"Click here for help"})]})},M=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,512)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,u=t.getLCP,p=t.getTTFB;n(e),a(e),i(e),u(e),p(e)}))};s.a.render(Object(a.jsx)(u.a.StrictMode,{children:Object(a.jsx)(g,{})}),document.getElementById("root")),M()}},[[508,1,2]]]);
//# sourceMappingURL=main.e36c9868.chunk.js.map