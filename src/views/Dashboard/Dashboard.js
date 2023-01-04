import React, { useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import Deposit from './components/deposit';
import CountUp from 'react-countup';
import bombFinance, {TVL } from '../../bomb-finance'
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import { makeStyles } from '@material-ui/core/styles';
import { roundAndFormatNumber } from '../../0x';
import useBombStats from '../../hooks/useBombStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import TokenSymbol from '../../components/TokenSymbol';
import ProgressCountdown from './components/ProgressCountdown';
import './Dashboard.css'
import { Box, Card, Table,CardContent, Button, Typography, Grid, ImageListItem } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import metamask from '../../assets/img/metamask-fox.svg'
import discord from '../../assets/img/discord.svg'
import bomb from '../../assets/img/bomb.png'
import bomb1 from '../../assets/img/bomb1.png'
import bomb2 from '../../assets/img/bomb2.png'
import bomb3 from '../../assets/img/bbond.png'
import bshare from '../../assets/img/bshares.png'
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import useCashPriceInLastTwap from '../../hooks/useCashPriceInLastTWAP'
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';
import docs from'../../'
import DashboardImage from '../../assets/img/background.jpg';
import CardIcon from '../../components/CardIcon';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import useTokenBalance from '../../hooks/useTokenBalance';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { IoLogoDiscord } from 'react-icons/io5';
import useXbombAPR from '../../hooks/useXbombAPR';
import {getDisplayBalance} from '../../utils/formatBalance';
import useEarnings from '../../hooks/useEarnings';
import Claim from './components/claimReward';
import bshbnb from '../../assets/img/bshare-bnb-LP.png'
import bombbtc from '../../assets/img/bomb-btc-lp-512.png'
import useBoardRoomTVL from '../../hooks/useBoardRoomTVL';
import Bank from '../Bank/Bank'
import useBanks from '../../hooks/useBanks';
import FarmCard from '../Farm/FarmCard';
import Harvest from './components/Harvest'
import Stake from './components/Stake';
import useWithdraw from '../../hooks/useWithdraw';
import Icon from '../../components/Icon';
import bbond from '../../assets/img/bbond.png';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${DashboardImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;




const TITLE = 'bomb.money | Dashboard';

const useStyles = makeStyles((theme) => ({
    gridItem: {
      height: '100%',
      [theme.breakpoints.up('md')]: {
        height: '90px',
      },
    }
  }));




const Dashboard = () => {
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const cashStat = useCashPriceInEstimatedTWAP();
  const TVL = useTotalValueLocked();
  const BoardRoomTVL = useBoardRoomTVL();
  const lastStat = useCashPriceInLastTwap();
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]); 
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  const bBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const bBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const bBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const bBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const lastScalingFactor = (Number(lastStat) / 100000000000000).toFixed(4); 
  const boardroomAPR = useFetchBoardroomAPR();
  const dailyBoardroomAPR = (Number(boardroomAPR/365)).toFixed(2);
  const earnings = useEarnings();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const earnedInDollars = (Number(bombPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const stakedInDollars = (Number(bSharePriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2);
  const totalStaked = useTotalStakedOnBoardroom();
  
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const activeBanks = banks.filter((bank) => !bank.finished);


    return(
      <>
      <Page>
        <BackgroundImage/>
        <Helmet>
        <title>{TITLE}</title>
      </Helmet>
        
          <div className='main'>
            <Card className='Card'>
            <p>Bomb Finance Summary</p>
                                <hr/>
                            <table style={{float:'left'}}>
                                <tr>
                                    <th></th>
                                    <th>Current Supply</th>
                                    <th>Total Supply</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='dash-container'>
                                      <img src={bomb1} style={{width:20,height:20}}/>
                                      <div><text>$BOMB</text></div>
                                    </div>
                                  </td>
                                  <td>
                                    {roundAndFormatNumber(bombCirculatingSupply, 2)}
                                  </td>
                                  <td>
                                  {roundAndFormatNumber(bombTotalSupply, 2)}
                                  </td>
                                  <td>
                                  ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}
                                  <br/>
                                  {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                                  </td>
                                  <td>
                                    <img src={metamask} style={{width:35,height:31.41}}/>
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                  <div className='dash-container'>
                                      <img src={bomb2} style={{width : 20,height:20}}/>
                                      <div><text>$BSHARE</text></div>
                                    </div>
                                  </td>
                                  <td>
                                    {roundAndFormatNumber(bShareCirculatingSupply, 2)}
                                  </td>
                                  <td>
                                  {roundAndFormatNumber(bShareTotalSupply, 2)}
                                  </td>
                                  <td>
                                  ${bSharePriceInDollars ? roundAndFormatNumber(bSharePriceInDollars, 2) : '-.--'}
                                  <br/>
                                  {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BTC
                                  </td>
                                  <td>
                                    <img src={metamask} style={{width:35,height:31.41}} />
                                  </td>
                                </tr>


                                <tr>
                                  <td>
                                  <div className='dash-container'>
                                    <img src={bomb3} style={{width : 20,height:20}}/>
                                      <div><text>$BBOND</text></div>
                                    </div>
                                  </td>
                                  <td>
                                    {roundAndFormatNumber(bBondCirculatingSupply, 2)}
                                  </td>
                                  <td>
                                  {roundAndFormatNumber(bBondTotalSupply, 2)}
                                  </td>
                                  <td>
                                  ${bBondPriceInDollars ? roundAndFormatNumber(bBondPriceInDollars, 2) : '-.--'}
                                  <br/>
                                  {bBondPriceInBNB ? bBondPriceInBNB : '-.----'} BTC
                                  </td>
                                  <td>
                                    <img src={metamask} style={{width:35,height:31.41}}/>
                                  </td>
                                </tr>
                            </table>
                            <div style={{float:'right',paddingRight:40,alignItems:'center'}}>
                              <center>Current Epoch</center>
                              <Typography><center>{Number(currentEpoch)}</center></Typography>
                              <hr style={{width:185.01}}/>
                              <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                              <Typography><center>Next Epoch in</center></Typography>
                              <hr style={{width:128}}/>
                              <center >Live TWAP: <text style={{color:'green'}}>{scalingFactor}</text></center>
                              <center >TVL: <text style={{color:'green'}}>${roundAndFormatNumber(TVL,2)}</text></center>
                              <center >Last Epoch TWAP: <text style={{color:'green'}}>{lastScalingFactor}</text></center>
                            </div>

            </Card>
          <div style={{display:'flex',flexDirection:'row'}}>                    
            <div>
            <div className='Card3'>
              <div className='Card2'>
                  <a href='https://docs.bomb.money/strategies/general-quick-roi-strategy'><text style={{float:'right',color: 'rgba(158, 230, 255, 1)'}}>Read Investment Strategy</text></a>
              </div>
                 <Button href='https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A' style={{backgroundColor:'rgb(19,153,156)',color :'white',font:'Nunito',width:640,height:40,marginBottom:4}}>Invest Now</Button>
                 <div style={{display:'flex',flexDirection:'row'}}>
                 <Button href="http://discord.bomb.money/" style={{backgroundColor:'rgba(255, 255, 255, 0.5)',color:'black',font:'Nunito',width:300,height:40}}><img src={discord}/>Chat on Discord</Button>
                 <Button href='href="https://docs.bomb.money"' style={{backgroundColor:'rgba(255, 255, 255, 0.5)',color:'black',font:'Nunito',width:300,height:40,marginLeft:40}}>Read Docs</Button>
                </div>
            </div>
            <Card className='Card4'>
                <div className='insane'>
                  <img src={bshare} width='48px' height='48px'/>
                  <text>BoardRoom 
                    <Button style={{backgroundColor: 'rgba(0, 232, 162, 0.5)',color:'white',width:110,height:16,fontSize:12,marginLeft:15}}>Recommended</Button>
                    <br/> 
                    <text style={{fontSize:14}}>Stake BShare and earn BOMB every epoch
                      <text style={{marginLeft:170}}>TVL:${Number(BoardRoomTVL).toFixed(2)}</text>
                    </text>
                  </text>
                </div>
                <hr/>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{margin:10,textAlign:'right'}}>
                      <text>Total Staked:<img src={bshare} width='16px' height='16px'/>{Number(getDisplayBalance(totalStaked)).toFixed(2)} </text>
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                      <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                        <text style={{fontSize:14}}>Daily Returns:</text>
                        <text style={{fontSize:16}}>{dailyBoardroomAPR}%</text>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                        <text style={{fontSize:14}}>Your Stake:</text>
                        <text><img src={bshare} style={{width:18,height:18}}/>{Number(getDisplayBalance(stakedBalance)).toFixed(2)}</text>
                        <text>{`≈ $${stakedInDollars}`}</text>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                        <text style={{fontSize:14}}>Earned:</text>
                        <text><img src={bomb} style={{width:18,height:18}}/>{Number(getDisplayBalance(earnings)).toFixed(2)}</text>
                        <text>{`≈ $${earnedInDollars}`}</text>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',margin:15}}>
                        <div style={{display:'flex',flexDirection:'row'}}>
                          <Deposit/>
                          <Button variant='outlined'style={{borderRadius:20,borderColor:'rgba(255, 255, 255, 1)',width:120,height:20,fontSize:15,marginLeft:20}}>Withdraw</Button>
                        </div>
                        <div>
                          <Claim/>
                        </div>
                      </div>
                    </div>
                  </div>
            </Card>
            </div>
            <div style={{objectFit:'contain',marginLeft:30}}>
              <Card className='latestNews' style={{width:382,height:336,position:'relative'}}>
                <text style={{fontSize:22}}>Latest News</text>
              </Card>
            </div>
            
          </div>
          <div style={{height:500,width:1046,backgroundColor:'blue',color:'white',border:'1px solid rgba(114, 140, 223, 1)',paddingLeft:10,display:'flex',flexDirection:'column',borderRadius:10,background:'rgba(35, 40, 75, 0.75)'}}>
                <br/>
                <text style={{fontSize:22,textStyle:'normal'}}>Bomb Farms</text>
                <div style={{display:'flex',flexDirection:'row'}}>  
                  <text style={{fontSize:14}}>Stake your LP tokens in our farms to start earning $BSHARE</text>
                  <Button variant='outlined' style={{borderRadius:20,borderColor:'rgba(255, 255, 255, 1)',width:120,height:20,fontSize:15,marginLeft:400}}>Claim All</Button>
                </div>
                <br/>
                <Card className='Card5'>
                          <div className='insane'>
                            <img src={bombbtc} width='33px' height='33px'/>
                            <text>BOMB-BTCB
                              <Button style={{backgroundColor: 'rgba(0, 232, 162, 0.5)',color:'white',width:110,height:16,fontSize:12,marginLeft:15}}>Recommended</Button>
                              <br/> 
                              <text style={{marginLeft:700}}>TVL:${Number(TVL).toFixed(2)}</text>
                              
                            </text>
                          </div>
                          <hr/>
                            <div style={{display:'flex',flexDirection:'column'}}>
                              
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                                  <text style={{fontSize:14}}>Daily Returns:</text>
                                  <text style={{fontSize:16}}>{dailyBoardroomAPR}%</text>
                                </div>
                                <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                                  <text style={{fontSize:14}}>Your Stake:</text>
                                  <text><img src={bshare} style={{width:18,height:18}}/>{Number(getDisplayBalance(stakedBalance)).toFixed(2)}</text>
                                  <text>{`≈ $${stakedInDollars}`}</text>
                                </div>
                                <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                                  <text style={{fontSize:14}}>Earned:</text>
                                  <text><img src={bomb} style={{width:18,height:18}}/>{Number(getDisplayBalance(earnings)).toFixed(2)}</text>
                                  <text>{`≈ $${earnedInDollars}`}</text>
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginLeft:100}}>
                                {activeBanks
                                      .filter((bank) => bank.sectionInUI === 1)
                                      .map((bank) => (
                                        <React.Fragment key={bank.name}>
                                          <Stake bank={bank}/>
                                        </React.Fragment>
                                      ))}
                                    <Button variant='outlined' style={{width:170,height:20,borderRadius:20,border:'1px solid white',margin:10}}>Withdraw</Button>
                                    
                                      {activeBanks
                                        .filter((bank) => bank.sectionInUI === 1)
                                        .map((bank) => (
                                          <Harvest bank={bank}/>
                                          
                                        ))}
                                </div>
                              </div>
                            </div>
            </Card>
            <Card className='Card5'>
                          <div className='insane'>
                            <img src={bshbnb} width='33px' height='33px'/>
                            <text>BSHARE-BNB
                              <Button style={{backgroundColor: 'rgba(0, 232, 162, 0.5)',color:'white',width:110,height:16,fontSize:12,marginLeft:15}}>Recommended</Button>
                              <br/> 
                              <text style={{marginLeft:700}}>TVL:${Number(TVL).toFixed(2)}</text>
                              
                            </text>
                          </div>
                          <hr/>
                            <div style={{display:'flex',flexDirection:'column'}}>
                              
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                                  <text style={{fontSize:14}}>Daily Returns:</text>
                                  <text style={{fontSize:16}}>{dailyBoardroomAPR}%</text>
                                </div>
                                <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                                  <text style={{fontSize:14}}>Your Stake:</text>
                                  <text><img src={bshare} style={{width:18,height:18}}/>{Number(getDisplayBalance(stakedBalance)).toFixed(2)}</text>
                                  <text>{`≈ $${stakedInDollars}`}</text>
                                </div>
                                <div style={{display:'flex',flexDirection:'column',margin:15}}> 
                                  <text style={{fontSize:14}}>Earned:</text>
                                  <text><img src={bomb} style={{width:18,height:18}}/>{Number(getDisplayBalance(earnings)).toFixed(2)}</text>
                                  <text>{`≈ $${earnedInDollars}`}</text>
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginLeft:100}}>
                                    {activeBanks
                                      .filter((bank) => bank.sectionInUI === 1)
                                      .map((bank) => (
                                        <React.Fragment key={bank.name}>
                                          <Stake bank={bank}/>
                                        </React.Fragment>
                                      ))}
                                      <Button variant='outlined' style={{width:170,height:20,borderRadius:20,border:'1px solid white',margin:10}}>Withdraw</Button>

                                      {activeBanks
                                      .filter((bank) => bank.sectionInUI === 1)
                                      .map((bank) => (
                                        <React.Fragment key={bank.name}>
                                          <Harvest bank={bank} />
                                        </React.Fragment>
                                      ))}
                                    
                                    
                                </div>
                              </div>
                            </div>
            </Card>

          </div>
          <Card className='Card6'>
                <div style={{display:'flex',flexDirection:'row',height:80}}>
                    <img src={bbond} width='48px' height='48px'/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <text style={{fontSize:22}}>Bonds </text>
                      <text style={{fontSize:14,margin:3}}>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</text>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                      <div style={{display:'flex',flexDirection:'column',width:351,textAlign:'center'}}>
                          <text style={{fontSize:16}}>Current Price: (Bomb)^2</text>
                          <br/>
                          <text style={{fontSize:22}}>BBond = {bBondPriceInBNB ? bBondPriceInBNB : '-.----'} BTC</text>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',width:351,textAlign:'center'}}>
                          <text style={{fontSize:16}}>Available to Redeem:</text>
                          <br/>
                          <div style={{display:'flex',flexDirection:'row',marginLeft:60}}>
                            <img src={bbond} style={{width:33,height:33}}/>
                            <text style={{fontSize:22}}>456</text>
                          </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',width:351,textAlign:'center'}}>
                        <div style={{display:'flex',flexDirection:'row'}}>
                          <text style={{fontSize:16,width:220}}>Purchase BBond<br/>Bomb is over peg</text>
                          <Button variant='outlined' style={{borderRadius:'20px',border:'1px solid white'}}>Purchase</Button>
                        </div>
                        <hr style={{border:'0.5px solid rgba(195, 197, 203, 0.75)',width:250}}/>
                          <div style={{display:'flex',flexDirection:'row'}}>
                          <text style={{fontSize:20,width:220}}>Redeem Bomb</text>
                          <Button variant='outlined' style={{borderRadius:'20px',border:'1px solid white'}}>Redeem</Button>
                        </div>
                      </div>
                              
                </div>                          
          </Card>
          
          </div>
      </Page>
      
      </>
    )

}

export default Dashboard;
