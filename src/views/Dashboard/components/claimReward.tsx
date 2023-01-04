import React, {useMemo} from 'react';
import styled from 'styled-components';

import {Box, Button, Card, CardContent, Typography} from '@material-ui/core';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerBoardroom from '../../../hooks/boardroom/useClaimRewardTimerBoardroom';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';
import ProgressCountdown from './ProgressCountdown';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useBombStats from '../../../hooks/useBombStats';
import {getDisplayBalance} from '../../../utils/formatBalance';

const Claim: React.FC = () => {
  const bombStats = useBombStats();
  const {onReward} = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const {from, to} = useClaimRewardTimerBoardroom();

  return (
    <>
              <Button
                variant='outlined' style={{borderRadius:20,borderColor:'rgba(255, 255, 255, 1)',marginTop:10,width:260,marginLeft:20}}
                onClick={onReward}
                className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Rewards
              </Button>
            
        {canClaimReward ? (
          ''
        ) : (
            <div>
              <Typography style={{textAlign: 'center'}}>Claim possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />
            </div>
        )}
      
    </>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Claim;
