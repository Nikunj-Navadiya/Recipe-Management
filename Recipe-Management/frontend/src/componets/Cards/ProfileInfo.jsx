import React from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout, onLogin }) => {
  return (
    <div className="flex items-center gap-3">
      {userInfo ? (
        <>
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
            {getInitials(userInfo.fullname)}
          </div>
          <div>
            <button className="btn-primary text-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <button className="btn-primary text-sm" onClick={onLogin}>
          Login
        </button>
      )}
    </div>
  );
};



export default ProfileInfo;
