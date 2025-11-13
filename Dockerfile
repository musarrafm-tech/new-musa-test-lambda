# Use AWS Lambda Node.js base image
FROM public.ecr.aws/lambda/nodejs:20

# Copy function code to Lambda task root
COPY index.js ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler (index.handler)
CMD [ "index.handler" ]