export async function sendAndInclude(tx, account) {
  return new Promise(async (resolve) => {
    let success = false;
    let blockHash = "";
    const unsubscribe = await tx.signAndSend(
      account,
      async ({ events = [], status, dispatchError }) => {
        if (status.isInBlock) {
          success = dispatchError ? false : true;
          blockHash = status.asInBlock;
          let feeInfo = {};
          let paymentInfo = (await tx.paymentInfo(account.address)).toHuman();
          events.forEach(({ phase, event: { data, method, section } }) => {
            // console.log(`included: ${phase} : ${section}.${method} ${data}`);
            if (`${section}.${method}` == "treasury.Deposit") {
              treasuryDeposit = data[0].toHuman();
              // console.error({...paymentInfo.toHuman(), treasuryDeposit});
              feeInfo = { ...paymentInfo, treasuryDeposit };
            }
          });
          console.error(
            `${
              success ? "🌝" : "🌚"
            } Transaction ${tx.meta.name}(..) included at block ${blockHash}`,
            feeInfo,
          );
          unsubscribe();
          resolve({ success, blockHash, events, feeInfo });
        }
      },
    );
  });
}
