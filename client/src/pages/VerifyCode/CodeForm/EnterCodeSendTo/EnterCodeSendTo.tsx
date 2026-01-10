const EnterCodeSendTo = ({ emailUser }) => {
  if (!emailUser) 

  return (
    <div className="mb-6 w-full text-center text-base">
      <p>
        Enter the 6- digit code we sent to <b>{emailUser}</b> to finish your login.
      </p>
    </div>
  );
};

export default EnterCodeSendTo;
