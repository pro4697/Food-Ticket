import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, message } from 'antd';
import { StyledApp } from '../../common/Style_Etc';
const { Title } = Typography;

const InputFeedback = styled.div`
	color: red;
`;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

function RegisterPage(props) {
	const dispatch = useDispatch();

	return (
		<Formik
			initialValues={{
				email: '',
				name: '',
				password: '',
				confirmPassword: '',
			}}
			validationSchema={Yup.object().shape({
				name: Yup.string().required('Name is required'),
				email: Yup.string().email('Email is invalid.').required('Email is required'),
				password: Yup.string()
					.min(6, 'Password must be at least 6 characters')
					.required('Password is required'),
				confirmPassword: Yup.string()
					.oneOf([Yup.ref('password'), null], 'Passwords must match')
					.required('Confirm Password is required'),
			})}
			onSubmit={(values, { setSubmitting }) => {
				setTimeout(() => {
					let dataToSubmit = {
						email: values.email,
						password: values.password,
						name: values.name,
						image: `uploads/images/no-user.svg`,
					};

					dispatch(registerUser(dataToSubmit)).then((response) => {
						if (response.payload.success) {
							props.history.push('/login');
						} else {
							message.error('이미 존재하는 email입니다.', 2);
						}
					});
					setSubmitting(false);
				}, 500);
			}}
		>
			{(props) => {
				const {
					values,
					touched,
					errors,
					isSubmitting,
					handleChange,
					handleBlur,
					handleSubmit,
				} = props;
				return (
					<StyledApp>
						<Title level={2}>Sign up </Title>
						<Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit}>
							<Form.Item required label='name'>
								<Input
									id='name'
									placeholder='name'
									type='text'
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									className={errors.name && touched.name ? 'text-input error' : 'text-input'}
								/>
								{errors.name && touched.name && <InputFeedback>{errors.name}</InputFeedback>}
							</Form.Item>

							<Form.Item
								required
								label='email'
								hasFeedback
								validateStatus={errors.email && touched.email ? 'error' : 'success'}
							>
								<Input
									id='email'
									placeholder='email'
									type='email'
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{errors.email && touched.email && <InputFeedback>{errors.email}</InputFeedback>}
							</Form.Item>

							<Form.Item
								required
								label='password'
								hasFeedback
								validateStatus={errors.password && touched.password ? 'error' : 'success'}
							>
								<Input
									id='password'
									placeholder='password'
									type='password'
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									className={
										errors.password && touched.password ? 'text-input error' : 'text-input'
									}
								/>
								{errors.password && touched.password && (
									<InputFeedback>{errors.password}</InputFeedback>
								)}
							</Form.Item>

							<Form.Item required label='confirm' hasFeedback>
								<Input
									id='confirmPassword'
									placeholder='confirm'
									type='password'
									value={values.confirmPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									className={
										errors.confirmPassword && touched.confirmPassword
											? 'text-input error'
											: 'text-input'
									}
								/>
								{errors.confirmPassword && touched.confirmPassword && (
									<InputFeedback>{errors.confirmPassword}</InputFeedback>
								)}
							</Form.Item>

							<Form.Item {...tailFormItemLayout}>
								<Button onClick={handleSubmit} type='primary' disabled={isSubmitting}>
									submit
								</Button>
							</Form.Item>
						</Form>
					</StyledApp>
				);
			}}
		</Formik>
	);
}

export default RegisterPage;