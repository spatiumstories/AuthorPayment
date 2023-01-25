"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsOptions = exports.PayAuthorStack = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const path_1 = require("path");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
class PayAuthorStack extends aws_cdk_lib_1.Stack {
    constructor(app, id) {
        super(app, id);
        const dynamoTable = new aws_dynamodb_1.Table(this, 'RareBooks', {
            partitionKey: {
                name: 'postHashHex',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            sortKey: {
                name: 'serial',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            readCapacity: 1,
            writeCapacity: 1,
            tableName: 'RareBooks',
            /**
             *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
             * the new table, and it will remain in your account until manually deleted. By setting the policy to
             * DESTROY, cdk destroy will delete the table (even if it has data in it)
             */
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY, // NOT recommended for production code
        });
        const nodeJsFunctionProps = {
            bundling: {
                externalModules: [
                    'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
                ],
            },
            depsLockFilePath: (0, path_1.join)(__dirname, 'lambdas', 'package-lock.json'),
            environment: {
                PRIMARY_KEY: 'postHashHex',
                SORT_KEY: 'serial',
                TABLE_NAME: dynamoTable.tableName,
            },
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
        };
        // Create a Lambda function for each of the CRUD operations
        // Lambdas needed:
        // 1. Add RARE book
        // 2. Scheduled Lambda that takes all RARE books, checks Deso for current ownership, pays author, and deletes item
        const addRareBook = new aws_lambda_nodejs_1.NodejsFunction(this, 'addRareBook', {
            entry: (0, path_1.join)(__dirname, 'lambdas', 'add-rare-book.ts'),
            ...nodeJsFunctionProps,
        });
        const checkRareBooks = new aws_lambda_nodejs_1.NodejsFunction(this, 'checkRareBooks', {
            entry: (0, path_1.join)(__dirname, 'lambdas', 'check-rare-books.js'),
            ...nodeJsFunctionProps,
        });
        const deleteRareBook = new aws_lambda_nodejs_1.NodejsFunction(this, 'deleteRareBook', {
            entry: (0, path_1.join)(__dirname, 'lambdas', 'delete-rare-book.ts'),
            ...nodeJsFunctionProps,
        });
        // Grant the Lambda function read access to the DynamoDB table
        dynamoTable.grantReadWriteData(addRareBook);
        dynamoTable.grantReadWriteData(checkRareBooks);
        dynamoTable.grantReadWriteData(deleteRareBook);
        // Create schedule for checkRareBooks lambda
        const eventRule = new aws_events_1.Rule(this, 'scheduleRule', {
            schedule: aws_events_1.Schedule.expression('rate(1 hour)'),
        });
        eventRule.addTarget(new aws_events_targets_1.LambdaFunction(checkRareBooks));
        // Integrate the Lambda functions with the API Gateway resource
        const addRareBookIntegration = new aws_apigateway_1.LambdaIntegration(addRareBook);
        const deleteRareBookIntegration = new aws_apigateway_1.LambdaIntegration(deleteRareBook);
        // Create an API Gateway resource for each of the CRUD operations
        const api = new aws_apigateway_1.RestApi(this, 'payAuthorAPI', {
            restApiName: 'Pay Author API'
        });
        const books = api.root.addResource('book');
        books.addMethod('POST', addRareBookIntegration);
        books.addMethod('DELETE', deleteRareBookIntegration);
        addCorsOptions(books);
    }
}
exports.PayAuthorStack = PayAuthorStack;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new aws_apigateway_1.MockIntegration({
        integrationResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                },
            }],
        passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
        requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
        },
    }), {
        methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Credentials': true,
                    'method.response.header.Access-Control-Allow-Origin': true,
                },
            }]
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new aws_cdk_lib_1.App();
new PayAuthorStack(app, 'PayAuthors');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBeUg7QUFDekgsMkRBQWdFO0FBQ2hFLHVEQUFpRDtBQUNqRCw2Q0FBd0Q7QUFDeEQscUVBQW9GO0FBQ3BGLCtCQUEyQjtBQUMzQix1REFBd0Q7QUFDeEQsdUVBQWdFO0FBRWhFLE1BQWEsY0FBZSxTQUFRLG1CQUFLO0lBQ3ZDLFlBQVksR0FBUSxFQUFFLEVBQVU7UUFDOUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sV0FBVyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQy9DLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUMzQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzNCO1lBQ0QsWUFBWSxFQUFFLENBQUM7WUFDZixhQUFhLEVBQUUsQ0FBQztZQUNoQixTQUFTLEVBQUUsV0FBVztZQUV0Qjs7OztlQUlHO1lBQ0gsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTyxFQUFFLHNDQUFzQztTQUM3RSxDQUFDLENBQUM7UUFFSCxNQUFNLG1CQUFtQixHQUF3QjtZQUMvQyxRQUFRLEVBQUU7Z0JBQ1IsZUFBZSxFQUFFO29CQUNmLFNBQVMsRUFBRSxvREFBb0Q7aUJBQ2hFO2FBQ0Y7WUFDRCxnQkFBZ0IsRUFBRSxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixDQUFDO1lBQ2pFLFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsYUFBYTtnQkFDMUIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUzthQUNsQztZQUNELE9BQU8sRUFBRSxv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LElBQUk7b0JBQzNELHlEQUF5RCxFQUFFLElBQUk7b0JBQy9ELG9EQUFvRCxFQUFFLElBQUk7aUJBQzNEO2FBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQTtBQUNKLENBQUM7QUExQkQsd0NBMEJDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSwgTGFtYmRhSW50ZWdyYXRpb24sIE1vY2tJbnRlZ3JhdGlvbiwgUGFzc3Rocm91Z2hCZWhhdmlvciwgUmVzdEFwaSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIFRhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IFJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBOb2RlanNGdW5jdGlvbiwgTm9kZWpzRnVuY3Rpb25Qcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgUnVsZSwgU2NoZWR1bGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZXZlbnRzJztcbmltcG9ydCB7IExhbWJkYUZ1bmN0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cy10YXJnZXRzJztcblxuZXhwb3J0IGNsYXNzIFBheUF1dGhvclN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKGFwcCwgaWQpO1xuXG4gICAgY29uc3QgZHluYW1vVGFibGUgPSBuZXcgVGFibGUodGhpcywgJ1JhcmVCb29rcycsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAncG9zdEhhc2hIZXgnLFxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklOR1xuICAgICAgfSxcbiAgICAgIHNvcnRLZXk6IHtcbiAgICAgICAgbmFtZTogJ3NlcmlhbCcsXG4gICAgICAgIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HXG4gICAgICB9LFxuICAgICAgcmVhZENhcGFjaXR5OiAxLFxuICAgICAgd3JpdGVDYXBhY2l0eTogMSxcbiAgICAgIHRhYmxlTmFtZTogJ1JhcmVCb29rcycsXG5cbiAgICAgIC8qKlxuICAgICAgICogIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxuICAgICAgICogdGhlIG5ldyB0YWJsZSwgYW5kIGl0IHdpbGwgcmVtYWluIGluIHlvdXIgYWNjb3VudCB1bnRpbCBtYW51YWxseSBkZWxldGVkLiBCeSBzZXR0aW5nIHRoZSBwb2xpY3kgdG9cbiAgICAgICAqIERFU1RST1ksIGNkayBkZXN0cm95IHdpbGwgZGVsZXRlIHRoZSB0YWJsZSAoZXZlbiBpZiBpdCBoYXMgZGF0YSBpbiBpdClcbiAgICAgICAqL1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLCAvLyBOT1QgcmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gY29kZVxuICAgIH0pO1xuXG4gICAgY29uc3Qgbm9kZUpzRnVuY3Rpb25Qcm9wczogTm9kZWpzRnVuY3Rpb25Qcm9wcyA9IHtcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGV4dGVybmFsTW9kdWxlczogW1xuICAgICAgICAgICdhd3Mtc2RrJywgLy8gVXNlIHRoZSAnYXdzLXNkaycgYXZhaWxhYmxlIGluIHRoZSBMYW1iZGEgcnVudGltZVxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGRlcHNMb2NrRmlsZVBhdGg6IGpvaW4oX19kaXJuYW1lLCAnbGFtYmRhcycsICdwYWNrYWdlLWxvY2suanNvbicpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICdwb3N0SGFzaEhleCcsXG4gICAgICAgIFNPUlRfS0VZOiAnc2VyaWFsJyxcbiAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgfSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgTGFtYmRhIGZ1bmN0aW9uIGZvciBlYWNoIG9mIHRoZSBDUlVEIG9wZXJhdGlvbnNcbiAgICAvLyBMYW1iZGFzIG5lZWRlZDpcbiAgICAvLyAxLiBBZGQgUkFSRSBib29rXG4gICAgLy8gMi4gU2NoZWR1bGVkIExhbWJkYSB0aGF0IHRha2VzIGFsbCBSQVJFIGJvb2tzLCBjaGVja3MgRGVzbyBmb3IgY3VycmVudCBvd25lcnNoaXAsIHBheXMgYXV0aG9yLCBhbmQgZGVsZXRlcyBpdGVtXG4gICAgY29uc3QgYWRkUmFyZUJvb2sgPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ2FkZFJhcmVCb29rJywge1xuICAgICAgZW50cnk6IGpvaW4oX19kaXJuYW1lLCAnbGFtYmRhcycsICdhZGQtcmFyZS1ib29rLnRzJyksXG4gICAgICAuLi5ub2RlSnNGdW5jdGlvblByb3BzLFxuICAgIH0pO1xuICAgIGNvbnN0IGNoZWNrUmFyZUJvb2tzID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdjaGVja1JhcmVCb29rcycsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgJ2xhbWJkYXMnLCAnY2hlY2stcmFyZS1ib29rcy5qcycpLFxuICAgICAgLi4ubm9kZUpzRnVuY3Rpb25Qcm9wcyxcbiAgICB9KTtcbiAgICBjb25zdCBkZWxldGVSYXJlQm9vayA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnZGVsZXRlUmFyZUJvb2snLCB7XG4gICAgICBlbnRyeTogam9pbihfX2Rpcm5hbWUsICdsYW1iZGFzJywgJ2RlbGV0ZS1yYXJlLWJvb2sudHMnKSxcbiAgICAgIC4uLm5vZGVKc0Z1bmN0aW9uUHJvcHMsXG4gICAgfSk7XG5cblxuICAgIC8vIEdyYW50IHRoZSBMYW1iZGEgZnVuY3Rpb24gcmVhZCBhY2Nlc3MgdG8gdGhlIER5bmFtb0RCIHRhYmxlXG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGFkZFJhcmVCb29rKTtcbiAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoY2hlY2tSYXJlQm9va3MpO1xuICAgIGR5bmFtb1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShkZWxldGVSYXJlQm9vayk7XG5cbiAgICAvLyBDcmVhdGUgc2NoZWR1bGUgZm9yIGNoZWNrUmFyZUJvb2tzIGxhbWJkYVxuICAgIGNvbnN0IGV2ZW50UnVsZSA9IG5ldyBSdWxlKHRoaXMsICdzY2hlZHVsZVJ1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIGhvdXIpJyksXG4gICAgfSk7XG4gICAgZXZlbnRSdWxlLmFkZFRhcmdldChuZXcgTGFtYmRhRnVuY3Rpb24oY2hlY2tSYXJlQm9va3MpKTtcblxuICAgIC8vIEludGVncmF0ZSB0aGUgTGFtYmRhIGZ1bmN0aW9ucyB3aXRoIHRoZSBBUEkgR2F0ZXdheSByZXNvdXJjZVxuICAgIGNvbnN0IGFkZFJhcmVCb29rSW50ZWdyYXRpb24gPSBuZXcgTGFtYmRhSW50ZWdyYXRpb24oYWRkUmFyZUJvb2spO1xuICAgIGNvbnN0IGRlbGV0ZVJhcmVCb29rSW50ZWdyYXRpb24gPSBuZXcgTGFtYmRhSW50ZWdyYXRpb24oZGVsZXRlUmFyZUJvb2spO1xuXG5cbiAgICAvLyBDcmVhdGUgYW4gQVBJIEdhdGV3YXkgcmVzb3VyY2UgZm9yIGVhY2ggb2YgdGhlIENSVUQgb3BlcmF0aW9uc1xuICAgIGNvbnN0IGFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICdwYXlBdXRob3JBUEknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ1BheSBBdXRob3IgQVBJJ1xuICAgIH0pO1xuXG4gICAgY29uc3QgYm9va3MgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnYm9vaycpO1xuICAgIGJvb2tzLmFkZE1ldGhvZCgnUE9TVCcsIGFkZFJhcmVCb29rSW50ZWdyYXRpb24pO1xuICAgIGJvb2tzLmFkZE1ldGhvZCgnREVMRVRFJywgZGVsZXRlUmFyZUJvb2tJbnRlZ3JhdGlvbik7XG4gICAgYWRkQ29yc09wdGlvbnMoYm9va3MpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogSVJlc291cmNlKSB7XG4gIGFwaVJlc291cmNlLmFkZE1ldGhvZCgnT1BUSU9OUycsIG5ldyBNb2NrSW50ZWdyYXRpb24oe1xuICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xuICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJyonXCIsXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogXCInZmFsc2UnXCIsXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUnXCIsXG4gICAgICB9LFxuICAgIH1dLFxuICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IFBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXG4gICAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IFwie1xcXCJzdGF0dXNDb2RlXFxcIjogMjAwfVwiXG4gICAgfSxcbiAgfSksIHtcbiAgICBtZXRob2RSZXNwb25zZXM6IFt7XG4gICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogdHJ1ZSxcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfV1cbiAgfSlcbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFBheUF1dGhvclN0YWNrKGFwcCwgJ1BheUF1dGhvcnMnKTtcbmFwcC5zeW50aCgpO1xuIl19