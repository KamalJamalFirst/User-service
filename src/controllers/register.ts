import "reflect-metadata"

// Function parameter Decorator Factory
// Overrides tsoa Body Decorator
export function Body() {
  return function (target: object, propertyKey: string | symbol, parameterIndex: number) {
    const existingMetadata = Reflect.getOwnMetadata('Body', target, propertyKey) || [];
    existingMetadata.push(parameterIndex);
    Reflect.defineMetadata('Body', existingMetadata, target, propertyKey);
  };
}

// Function Decorator Factory
// export function ValidateBody(validationSchema: ZodSchema) {
//   return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;

    
//     descriptor.value = async function (...args: any[]) {
//       // Retrieve the list of indices of the parameters that are decorated
//       // in order to retrieve the body
//       const bodyCandidates: number[] = Reflect.getOwnMetadata('Body', target, propertyKey) || [];
//       if (bodyCandidates.length === 0) {
//         throw BaseError.createInvalidArgumentError('missing body parameter');
//       }
//       const bodyIndex = bodyCandidates[0] as number;
//       // we've found the body in the list of parameters
//       // now we check if its payload is valid against the passed Zod schema
//       const check = await validationSchema.safeParseAsync(args[bodyIndex]);
//       if (!check.success) {
//         throw BaseError.createInvalidArgumentError(check.error.issues.map(issue => `${issue.message} for field/s [${issue.path.join(',')}]`).join(', '));
//       }
//       // the payload checkout!
//       // Call the original method with the arguments
//       return originalMethod.apply(this, args);
//     };
//   };
// }