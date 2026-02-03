import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Features from './Features';
import Transaction from './Transaction';
import Howsystem from './Howsystem';
import Instruction from './Instruction';
import Agency from './Agency';
import Footer from './Footer';
import Footermessge from './Footermessge';


function Index() {
  
  return (
    <>
    <Navbar/> 
    <Dashboard/>
    <Transaction/>
    <Howsystem/>
    <Instruction/>
    <Agency/>
    <Features/>
    <Footermessge/>
    <Footer/>
   </>
  );
}

export default Index;