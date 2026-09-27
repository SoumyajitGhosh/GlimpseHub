import Icon from "../Icon/Icon";

interface ProfileCategoryProps {
  category: string;
  icon: string;
}

const ProfileCategory = ({ category, icon }: ProfileCategoryProps) => (
  <div className="profile-categories">
    <div className="profile-categories__category">
      <Icon icon={icon} />
      <h3 className="font-medium">{category}</h3>
    </div>
  </div>
);

export default ProfileCategory;
