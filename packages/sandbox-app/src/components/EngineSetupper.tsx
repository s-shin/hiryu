// import React from "react";
// import { Stepper, Step, StepLabel, StepContent } from "@material-ui/core";
// import EngineSetupForm from "./EngineSetupForm";
// import EngineComfigurationForm from "./EngineConfigurationForm";

// interface EngineSetupperState {
//   step: number;
// }

// class EngineSetupper extends React.Component<{}, EngineSetupperState> {
//   state = { step: 0 };

//   render() {
//     return (
//       <div>
//         <Stepper activeStep={this.state.step} orientation="vertical">
//           <Step>
//             <StepLabel>Connect to Engine</StepLabel>
//             <StepContent>
//               <EngineSetupForm onSubmit={() => this.setState({ ...this.state, step: 1 })} />
//             </StepContent>
//           </Step>
//           <Step>
//             <StepLabel>Configure Engine</StepLabel>
//             <StepContent>
//               <EngineComfigurationForm engineOptions={{}} onSubmit={() => null} />
//             </StepContent>
//           </Step>
//           <Step>
//             <StepLabel>label</StepLabel>
//             <StepContent>content</StepContent>
//           </Step>
//         </Stepper>
//       </div>
//     );
//   }
// }

// export default EngineSetupper;
