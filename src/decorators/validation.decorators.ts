import 'reflect-metadata';
// import { ValidateError } from '@tsoa/runtime';
// import z from 'zod';

// // Function parameter Decorator Factory
// // Overrides tsoa Body Decorator
// export function Body() {
//   return function (target: object, propertyKey: string | symbol, parameterIndex: number) {
//     console.log("Body decorator called on", target, propertyKey, parameterIndex);
//     // const existingMetadata = Reflect.getOwnMetadata('Body', target, propertyKey) || [];
//     // existingMetadata.push(parameterIndex);
//     // Reflect.defineMetadata('Body', existingMetadata, target, propertyKey);
//   };
// }

// // Function Decorator Factory
// export function ValidateBody(validationSchema: z.ZodTypeAny) {
//   return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;

    
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     descriptor.value = async function (...args: any[]) {
//       // Retrieve the list of indices of the parameters that are decorated
//       // in order to retrieve the body
//       const bodyCandidates: number[] = Reflect.getOwnMetadata('Body', target, propertyKey) || [];
//       if (bodyCandidates.length === 0) {
//         throw new ValidateError({
//             body: {
//                 message: "The request body is missing.",
//             }}, "The request body is missing."
//         );
//       }
//       const bodyIndex = bodyCandidates[0] as number;
//       console.log(args[bodyIndex])
//       // we've found the body in the list of parameters
//       // now we check if its payload is valid against the passed Zod schema
//       const check = await validationSchema.safeParseAsync(args[bodyIndex]);
//       if (!check.success) {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const errorMessages = createFieldErrors(check.error.issues);
//         throw new ValidateError(errorMessages, "Property validation failed")
//     }
//       // the payload checkout!
//       // Call the original method with the arguments
//       return originalMethod.apply(this, args);
//     };
//   };
// }

// /**
//  * @param {Array<{message: string, path: string[]}>} issues - The array of validation issues.
//  * @returns {Object.<string, {message: string, value: any}>} The formatted error object.
//  */
// function createFieldErrors(issues: z.core.$ZodIssue[])  {

//   return Object.fromEntries(
//     issues.map(issue => {

//       const key = issue.path.join('.');


//       return [
//         key,
//         {
//           message: issue.message,
//           value: issue.path,
//         }
//       ];
//     })
//   );
// }