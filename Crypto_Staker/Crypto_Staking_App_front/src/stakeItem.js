import React, { useEffect, useState } from "react";
import { ListGroupItem, Input, Button } from "reactstrap";

const StakeItem = (props) => {
  // form value related variable
  const [inputAmount, setinputAmount] = useState(0);

  const handleChange02 = (e) => {
    // 👇 Store the input value to local state
    setinputAmount(e.target.value);
  };

  return (
    <ListGroupItem className="flex-space">
      {props.tokenObj.name}: {props.tokenObj.address}
      <Input
        className="tokenamount"
        placeholder="amount"
        size="sm"
        type="number"
        onChange={handleChange02}
        value={inputAmount}
      />
      <Button
        onClick={() => props.stake(props.tokenObj.address, inputAmount)}
        color="info"
      >
        Stake
      </Button>
      <Button
        onClick={() => props.unstake(props.tokenObj.address, inputAmount)}
        color="dark"
      >
        Unstake
      </Button>
    </ListGroupItem>
  );
};

export default StakeItem;
