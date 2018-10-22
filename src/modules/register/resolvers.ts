import * as bcrypt from 'bcryptjs';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().min(10).max(255).email(),
    password: yup.string().min(5).max(255)
})

export const resolvers: ResolverMap = {
    Query: {
        hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    },
    Mutation: {
        register: async (_, args: GQL.IRegisterOnMutationArguments) => {
            try {
                await schema.validate(args, { abortEarly: false })
            } catch (error) {
                console.log(error);

            }
            const { email, password } = args;
            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ['id']
            })
            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: "already taken"
                    }
                ]
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({
                email,
                password: hashedPassword
            });
            await user.save();
            return true;
        }
    }
}